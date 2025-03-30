package com.backend.PlanWise.Controllers;

import com.backend.PlanWise.DataTransferObjects.FileDTO;
import com.backend.PlanWise.DataTransferObjects.ListEntryDTO;
import com.backend.PlanWise.servicer.ListEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/entries")
public class ListEntryController
{
    @Autowired
    private ListEntryService listEntryService;

    @PostMapping
    public ResponseEntity<ListEntryDTO> createEntry(
            @RequestBody ListEntryDTO listEntryDTO,
            @RequestParam Long taskListId)
    {

        ListEntryDTO createdEntry = listEntryService.createEntry(listEntryDTO, taskListId);
        return ResponseEntity.ok(createdEntry);
    }

    @PutMapping("/{entryId}")
    public ResponseEntity<ListEntryDTO> updateEntry(
            @PathVariable Long entryId,
            @RequestBody ListEntryDTO listEntryDTO)
    {
        ListEntryDTO updatedEntry = listEntryService.updateEntry(entryId, listEntryDTO);
        return ResponseEntity.ok(updatedEntry);
    }

    @DeleteMapping("/{entryId}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long entryId)
    {
        listEntryService.deleteEntry(entryId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-tasklist/{taskListId}")
    public ResponseEntity<List<ListEntryDTO>> getEntriesByTaskList(@PathVariable Long taskListId)
    {
        List<ListEntryDTO> entries = listEntryService.getEntriesByTaskListId(taskListId);
        return ResponseEntity.ok(entries);
    }

    @PutMapping("/{entryId}/check")
    public ResponseEntity<ListEntryDTO> toggleCheckStatus(
            @PathVariable Long entryId,
            @RequestParam Boolean isChecked)
    {
        ListEntryDTO updatedEntry = listEntryService.toggleCheckStatus(entryId, isChecked);
        return ResponseEntity.ok(updatedEntry);
    }
}
