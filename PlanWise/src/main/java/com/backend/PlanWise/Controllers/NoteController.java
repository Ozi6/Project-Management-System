package com.backend.PlanWise.Controllers;

import com.backend.PlanWise.DataPool.UserDataPool;
import com.backend.PlanWise.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.backend.PlanWise.DataPool.NoteRepository;
import com.backend.PlanWise.DataPool.ProjectDataPool;
import com.backend.PlanWise.DataTransferObjects.NotesDTO;
import com.backend.PlanWise.model.Notes;
import com.backend.PlanWise.model.Project;
import com.backend.PlanWise.servicer.ProjectServicer;
import com.backend.PlanWise.servicer.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class NoteController
{

    private static final Logger logger = LoggerFactory.getLogger(NoteController.class);

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private ProjectDataPool projectRepository;

    @Autowired
    private ProjectServicer projectService;

    @Autowired
    private UserService clerkService;

    public NoteController() {
        logger.info("NoteController initialized");
    }

    private boolean checkUserAccessToProject(Long projectId, String token)
    {
        try{
            String userId = clerkService.getUserIdFromToken(token);
            logger.info("Checking access for user ID: {} to project ID: {}", userId, projectId);

            boolean isMember = projectService.isUserMemberOfProject(projectId, userId);
            logger.info("User {} is member of project {}: {}", userId, projectId, isMember);
            
            if(isMember)
                return true;

            boolean isOwner = projectService.isProjectOwner(projectId, userId);
            logger.info("User {} is owner of project {}: {}", userId, projectId, isOwner);
            
            return isOwner;
        }catch(Exception e){
            logger.error("Error checking project access for projectId: {}", projectId, e);
            return false;
        }
    }

    private boolean isUserProjectOwner(Long projectId, String token)
    {
        try{
            String userId = clerkService.getUserIdFromToken(token);
            boolean isOwner = projectService.isProjectOwner(projectId, userId);
            return isOwner;
        }catch(Exception e){
            logger.error("Error checking project ownership for projectId: {}", projectId, e);
            return false;
        }
    }

    @GetMapping("/projects/{projectId}/notes")
    public ResponseEntity<List<NotesDTO>> getNotesByProject(
            @PathVariable Long projectId, 
            @RequestHeader("Authorization") String token,
            @RequestHeader("userId") String userId)
    {
        logger.info("Getting notes for project ID: {} with userId: {}", projectId, userId);

        boolean isMember = projectService.isUserMemberOfProject(projectId, userId);
        if(!isMember)
        {
            boolean isOwner = projectService.isProjectOwner(projectId, userId);
            if(!isOwner)
            {
                logger.warn("Access denied: User {} doesn't have access to project ID: {}", userId, projectId);
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have access to this project");
            }
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                {
                    logger.error("Project not found with ID: {}", projectId);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
                });

        List<Notes> notes = noteRepository.findByProjectAndUserOrSharedOrderByCreatedAtDesc(
                project,
                userId,
                true);

        logger.info("Found {} notes for project ID: {}", notes.size(), projectId);

        List<NotesDTO> notesDTOs = notes.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(notesDTOs);
    }

    @Autowired
    UserDataPool userDataPool;

    @PostMapping("/notes")
    public ResponseEntity<NotesDTO> createNote(
            @RequestBody NotesDTO notesDTO, 
            @RequestHeader("Authorization") String token,
            @RequestHeader("userId") String userId)
    {
        logger.info("Creating note for project ID: {} by user: {}", notesDTO.getProjectId(), userId);

        boolean isMember = projectService.isUserMemberOfProject(notesDTO.getProjectId(), userId);
        boolean isOwner = projectService.isProjectOwner(notesDTO.getProjectId(), userId);
        
        if(!isMember && !isOwner)
        {
            logger.warn("Access denied: User {} doesn't have access to project ID: {}", userId, notesDTO.getProjectId());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have access to this project");
        }

        Project project = projectRepository.findById(notesDTO.getProjectId())
                .orElseThrow(() ->
                {
                    logger.error("Project not found with ID: {}", notesDTO.getProjectId());
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
                });

        String userFullName = clerkService.getUserFullName(token);
        if(userFullName == null)
            userFullName = "Unknown User";

        User user = userDataPool.findByUserId(userId);

        Notes note = new Notes();
        note.setTitle(notesDTO.getTitle());
        note.setContent(notesDTO.getContent());
        note.setProject(project);
        note.setUserId(user);
        note.setShared(notesDTO.getShared());
        note.setColor(notesDTO.getColor());
        note.setPinned(notesDTO.isPinned());
        note.setCreatedAt(LocalDateTime.now());
        note.setUpdatedAt(LocalDateTime.now());

        Notes savedNote = noteRepository.save(note);
        logger.info("Note created with ID: {} for project ID: {}", savedNote.getId(), project.getProjectId());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(savedNote));
    }

    @PutMapping("/notes/{id}")
    public ResponseEntity<NotesDTO> updateNote(
            @PathVariable Long id, 
            @RequestBody NotesDTO notesDTO, 
            @RequestHeader("Authorization") String token,
            @RequestHeader("userId") String userId) {
        
        logger.info("Updating note with ID: {} by user: {}", id, userId);
        
        Notes note = noteRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Note not found with ID: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found");
                });

        Long projectId = note.getProject().getProjectId();

        boolean isMember = projectService.isUserMemberOfProject(projectId, userId);
        logger.info("User {} is member of project {}: {}", userId, projectId, isMember);
        
        if(!isMember)
        {
            boolean isOwner = projectService.isProjectOwner(projectId, userId);
            logger.info("User {} is owner of project {}: {}", userId, projectId, isOwner);
            
            if(!isOwner)
            {
                logger.warn("Access denied: User {} doesn't have access to project ID: {}", userId, projectId);
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have access to this project");
            }
        }

        boolean isOwner = projectService.isProjectOwner(projectId, userId);
        if(!note.getUserId().equals(userId) && !isOwner && note.shared())
        {
            logger.warn("Permission denied: User {} is not the creator or project owner for note ID: {}", userId, id);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update this note");
        }

        note.setTitle(notesDTO.getTitle());
        note.setContent(notesDTO.getContent());
        note.setUpdatedAt(LocalDateTime.now());
        note.setColor(notesDTO.getColor());
        note.setPinned(notesDTO.isPinned());
        note.setShared(notesDTO.getShared());

        Notes updatedNote = noteRepository.save(note);
        logger.info("Note updated with ID: {}", updatedNote.getId());
        
        return ResponseEntity.ok(convertToDto(updatedNote));
    }

    @DeleteMapping("/notes/{id}")
    public ResponseEntity<Void> deleteNote(
            @PathVariable Long id, 
            @RequestHeader("Authorization") String token,
            @RequestHeader("userId") String userId)
    {
        logger.info("Deleting note with ID: {} by user: {}", id, userId);
        
        Notes note = noteRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Note not found with ID: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found");
                });

        Long projectId = note.getProject().getProjectId();

        boolean isMember = projectService.isUserMemberOfProject(projectId, userId);
        logger.info("User {} is member of project {}: {}", userId, projectId, isMember);
        
        if(!isMember)
        {
            boolean isOwner = projectService.isProjectOwner(projectId, userId);
            logger.info("User {} is owner of project {}: {}", userId, projectId, isOwner);
            
            if(!isOwner)
            {
                logger.warn("Access denied: User {} doesn't have access to project ID: {}", userId, projectId);
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have access to this project");
            }
        }

        boolean isOwner = projectService.isProjectOwner(projectId, userId);
        if(!note.getUserId().equals(userId) && !isOwner && note.shared())
        {
            logger.warn("Permission denied: User {} is not the creator or project owner for note ID: {}", userId, id);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete this note");
        }

        noteRepository.delete(note);
        logger.info("Note deleted with ID: {}", id);
        
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/notes/{id}")
    public ResponseEntity<NotesDTO> getNoteById(
            @PathVariable Long id, 
            @RequestHeader("Authorization") String token,
            @RequestHeader("userId") String userId)
    {
        
        logger.info("Getting note with ID: {} by user: {}", id, userId);
        
        Notes note = noteRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Note not found with ID: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found");
                });

        Long projectId = note.getProject().getProjectId();

        boolean isMember = projectService.isUserMemberOfProject(projectId, userId);
        logger.info("User {} is member of project {}: {}", userId, projectId, isMember);
        
        if(!isMember)
        {
            boolean isOwner = projectService.isProjectOwner(projectId, userId);
            logger.info("User {} is owner of project {}: {}", userId, projectId, isOwner);
            if(!isOwner)
            {
                logger.warn("Access denied: User {} doesn't have access to project ID: {}", userId, projectId);
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have access to this project");
            }
        }

        logger.info("Retrieved note with ID: {}", id);
        return ResponseEntity.ok(convertToDto(note));
    }

    private NotesDTO convertToDto(Notes note)
    {
        NotesDTO dto = new NotesDTO();
        dto.setId(note.getId());
        dto.setTitle(note.getTitle());
        dto.setContent(note.getContent());
        dto.setProjectId(note.getProject().getProjectId());
        dto.setPinned(note.pinned());
        dto.setShared(note.shared());
        dto.setColor(note.getColor());
        dto.setUserId(clerkService.convertToDTO(note.getUserId()));
        dto.setCreatedAt(note.getCreatedAt());
        dto.setUpdatedAt(note.getUpdatedAt());
        return dto;
    }

    @PatchMapping("/notes/{id}")
    public ResponseEntity<NotesDTO> patchNote(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates,
            @RequestHeader("Authorization") String token,
            @RequestHeader("userId") String userId)
    {
        logger.info("Patching note with ID: {} by user: {}", id, userId);

        Notes note = noteRepository.findById(id)
            .orElseThrow(() ->
            {
                logger.error("Note not found with ID: {}", id);
                return new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found");
            });

        Long projectId = note.getProject().getProjectId();

        boolean isMember = projectService.isUserMemberOfProject(projectId, userId);
        logger.info("User {} is member of project {}: {}", userId, projectId, isMember);

        if(!isMember)
        {
            boolean isOwner = projectService.isProjectOwner(projectId, userId);
            logger.info("User {} is owner of project {}: {}", userId, projectId, isOwner);

            if (!isOwner)
            {
                logger.warn("Access denied: User {} doesn't have access to project ID: {}", userId, projectId);
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have access to this project");
            }
        }

        boolean isOwner = projectService.isProjectOwner(projectId, userId);
        if(!note.getUserId().equals(userId) && !isOwner && note.shared())
        {
            logger.warn("Permission denied: User {} is not the creator or project owner for note ID: {}", userId, id);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update this note");
        }

        boolean updated = false;
        if (updates.containsKey("pinned") && updates.get("pinned") instanceof Boolean)
        {
            note.setPinned((Boolean) updates.get("pinned"));
            updated = true;
            logger.info("Updated pinned to {} for note ID: {}", note.pinned(), id);
        }
        if(updates.containsKey("shared") && updates.get("shared") instanceof Boolean)
        {
            note.setShared((Boolean) updates.get("shared"));
            updated = true;
            logger.info("Updated shared to {} for note ID: {}", note.shared(), id);
        }

        if(!updated)
        {
            logger.warn("No valid fields provided for patching note ID: {}", id);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No valid fields provided for update");
        }

        note.setUpdatedAt(LocalDateTime.now());

        Notes updatedNote = noteRepository.save(note);
        logger.info("Note patched successfully with ID: {}", updatedNote.getId());

        return ResponseEntity.ok(convertToDto(updatedNote));
    }
}