package com.backend.PlanWise.servicer;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.PlanWise.DataPool.ListEntryDataPool;
import com.backend.PlanWise.DataPool.TaskListDataPool;
import com.backend.PlanWise.DataPool.TeamDataPool;
import com.backend.PlanWise.DataPool.UserDataPool;
import com.backend.PlanWise.DataTransferObjects.FileDTO;
import com.backend.PlanWise.DataTransferObjects.ListEntryDTO;
import com.backend.PlanWise.DataTransferObjects.TeamDTO;
import com.backend.PlanWise.DataTransferObjects.UserDTO;
import com.backend.PlanWise.model.File;
import com.backend.PlanWise.model.ListEntry;
import com.backend.PlanWise.model.TaskList;
import com.backend.PlanWise.model.Team;
import com.backend.PlanWise.model.User;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class ListEntryService
{

    @Autowired
    private ListEntryDataPool listEntryDataPool;

    @Autowired
    private TaskListDataPool taskListDataPool;

    @Autowired
    private UserDataPool userDataPool;

    @Autowired
    private TeamDataPool teamDataPool;

    @Autowired
    private FileService fileService;

    @Autowired
    private RecentActivityService recentActivityService;

    public ListEntryDTO createEntry(ListEntryDTO listEntryDTO, Long taskListId) {
        TaskList taskList = taskListDataPool.findById(taskListId)
                .orElseThrow(() -> new RuntimeException("TaskList not found with id: " + taskListId));

        ListEntry entry = new ListEntry();
        entry.setEntryName(listEntryDTO.getEntryName());
        entry.setIsChecked(listEntryDTO.getIsChecked() != null ? listEntryDTO.getIsChecked() : false);
        entry.setDueDate(listEntryDTO.getDueDate());
        if(listEntryDTO.getDueDate() != null)
            entry.setWarningThreshold(listEntryDTO.getWarningThreshold() != null ? listEntryDTO.getWarningThreshold() : 1);
        else
            entry.setWarningThreshold(null);
        entry.setTaskList(taskList);

        if (listEntryDTO.getFile() != null && listEntryDTO.getFile().getFileId() != null)
        {
            File file = fileService.getFileEntity(listEntryDTO.getFile().getFileId());
            entry.setFile(file);
        }

        ListEntry savedEntry = listEntryDataPool.save(entry);

        recentActivityService.createSystemActivity(
            savedEntry.getTaskList().getCategory().getProject().getProjectId(), 
            "CREATE", 
            "ENTRY", 
            savedEntry.getEntryId(), 
            savedEntry.getEntryName()
            );
        return convertToDTO(savedEntry);
    }

    public ListEntryDTO updateEntry(Long entryId, ListEntryDTO listEntryDTO)
    {
        ListEntry existingEntry = listEntryDataPool.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Entry not found with id: " + entryId));

                recentActivityService.createSystemActivity(
                    existingEntry.getTaskList().getCategory().getProject().getProjectId(), 
                    "UPDATE", 
                    "ENTRY", 
                    existingEntry.getEntryId(), 
                    existingEntry.getEntryName()
                    );


        existingEntry.setEntryName(listEntryDTO.getEntryName());
        if (listEntryDTO.getIsChecked() != null)
            existingEntry.setIsChecked(listEntryDTO.getIsChecked());
        existingEntry.setDueDate(listEntryDTO.getDueDate());
        if(listEntryDTO.getDueDate() != null)
            existingEntry.setWarningThreshold(listEntryDTO.getWarningThreshold() != null ? listEntryDTO.getWarningThreshold() : 1);
        else
            existingEntry.setWarningThreshold(null);

        if (listEntryDTO.getFile() != null)
        {
            if (listEntryDTO.getFile().getFileId() != null)
            {
                File file = fileService.getFileEntity(listEntryDTO.getFile().getFileId());
                existingEntry.setFile(file);
            }
            else
                existingEntry.setFile(null);
        }

        if(listEntryDTO.getAssignedUsers() != null)
        {
            Set<User> users = new HashSet<>();
            for (UserDTO userDTO : listEntryDTO.getAssignedUsers())
            {
                User user = userDataPool.findById(userDTO.getUserId())
                        .orElseThrow(() -> new RuntimeException("User not found with id: " + userDTO.getUserId()));
                users.add(user);
            }
            existingEntry.setAssignedUsers(users);
        }

        if(listEntryDTO.getAssignedTeams() != null)
        {
            Set<Team> teams = new HashSet<>();
            for (TeamDTO teamDTO : listEntryDTO.getAssignedTeams())
            {
                Team team = teamDataPool.findById(teamDTO.getTeamId())
                        .orElseThrow(() -> new RuntimeException("Team not found with id: " + teamDTO.getTeamId()));
                teams.add(team);
            }
            existingEntry.setAssignedTeams(teams);
        }

        ListEntry updatedEntry = listEntryDataPool.save(existingEntry);

        

        return convertToDTO(updatedEntry);
    }

    @Transactional
    public void deleteEntry(Long entryId)
    {
        ListEntry entry = listEntryDataPool.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Entry not found with id: " + entryId));

        recentActivityService.createSystemActivity(
            entry.getTaskList().getCategory().getProject().getProjectId(), 
            "DELETE", 
            "ENTRY", 
            entry.getEntryId(), 
            entry.getEntryName()
            );

        File attachedFile = entry.getFile();
        try{
            listEntryDataPool.deleteById(entryId);
            if(attachedFile != null)
                fileService.deleteFile(attachedFile.getFileId());
        }catch(Exception e){
            throw new RuntimeException("Failed to delete entry and associated file", e);
        }
    }

    public List<ListEntryDTO> getEntriesByTaskListId(Long taskListId)
    {
        List<ListEntry> entries = listEntryDataPool.findByTaskListTaskListId(taskListId);
        return entries.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ListEntryDTO toggleCheckStatus(Long entryId, Boolean isChecked)
    {
        ListEntry entry = listEntryDataPool.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Entry not found with id: " + entryId));

        entry.setIsChecked(isChecked);
        ListEntry updatedEntry = listEntryDataPool.save(entry);
        return convertToDTO(updatedEntry);
    }

    @Autowired
    private UserService userService;

    private ListEntryDTO convertToDTO(ListEntry entry)
    {
        ListEntryDTO dto = new ListEntryDTO();
        dto.setEntryId(entry.getEntryId());
        dto.setEntryName(entry.getEntryName());
        dto.setIsChecked(entry.getIsChecked());
        dto.setDueDate(entry.getDueDate());
        if(entry.getDueDate() != null)
            dto.setWarningThreshold(entry.getWarningThreshold() != null ? entry.getWarningThreshold() : 1);
        else
            dto.setWarningThreshold(null);

        if (entry.getFile() != null)
        {
            FileDTO fileDTO = new FileDTO();
            fileDTO.setFileId(entry.getFile().getFileId());
            fileDTO.setFileName(entry.getFile().getFileName());
            fileDTO.setFileSize(entry.getFile().getFileSize());
            fileDTO.setFileType(entry.getFile().getFileType());
            dto.setFile(fileDTO);
        }

        Set<UserDTO> userDTOs = new HashSet<>();
        for(User user : entry.getAssignedUsers())
            userDTOs.add(userService.convertToDTO(user));
        dto.setAssignedUsers(userDTOs);

        //Set<TeamDTO> teamDTOs = new HashSet<>();
        //for(Team team : entry.getAssignedTeams())
            //teamDTOs.add(teamService.convertToDTO(team));
        //dto.setAssignedTeams(teamDTOs);

        return dto;
    }

    public ListEntryDTO getEntryById(Long entryId)
    {
        ListEntry entry = listEntryDataPool.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Entry not found with id: " + entryId));
        return convertToDTO(entry);
    }

    public ListEntryDTO moveEntryToNewList(Long entryId, Long newTaskListId)
    {
        ListEntry entry = listEntryDataPool.findById(entryId)
                .orElseThrow(() -> new EntityNotFoundException("Entry not found with id: " + entryId));

        TaskList newTaskList = taskListDataPool.findById(newTaskListId)
                .orElseThrow(() -> new EntityNotFoundException("Task list not found with id: " + newTaskListId));

        entry.setTaskList(newTaskList);
        ListEntry updatedEntry = listEntryDataPool.save(entry);

        return convertToDTO(updatedEntry);
    }

    @Transactional
    public void deleteAllEntriesInTaskList(Long taskListId)
    {
        List<Long> fileIds = listEntryDataPool.findFileIdsByTaskListId(taskListId);
        listEntryDataPool.deleteByTaskListTaskListId(taskListId);
        if(!fileIds.isEmpty())
            fileService.deleteAllFilesByIds(fileIds);
    }

    @Transactional
    public void deleteAllByTaskListIds(List<Long> taskListIds)
    {
        List<Long> fileIds = listEntryDataPool.findFileIdsByTaskListIds(taskListIds);
        listEntryDataPool.deleteByTaskListIdIn(taskListIds);
        if (!fileIds.isEmpty())
            fileService.deleteAllFilesByIds(fileIds);
    }
}
