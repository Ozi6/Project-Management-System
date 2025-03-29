package com.backend.PlanWise.servicer;

import com.backend.PlanWise.DataPool.ListEntryDataPool;
import com.backend.PlanWise.DataPool.TaskListDataPool;
import com.backend.PlanWise.DataTransferObjects.ListEntryDTO;
import com.backend.PlanWise.model.ListEntry;
import com.backend.PlanWise.model.TaskList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ListEntryService
{

    @Autowired
    private ListEntryDataPool listEntryDataPool;

    @Autowired
    private TaskListDataPool taskListDataPool;

    public ListEntryDTO createEntry(ListEntryDTO listEntryDTO, Long taskListId) {
        TaskList taskList = taskListDataPool.findById(taskListId)
                .orElseThrow(() -> new RuntimeException("TaskList not found with id: " + taskListId));

        ListEntry entry = new ListEntry();
        entry.setEntryName(listEntryDTO.getEntryName());
        entry.setIsChecked(listEntryDTO.getIsChecked() != null ? listEntryDTO.getIsChecked() : false);
        entry.setDueDate(listEntryDTO.getDueDate());
        entry.setWarningThreshold(listEntryDTO.getWarningThreshold());
        entry.setTaskList(taskList);

        ListEntry savedEntry = listEntryDataPool.save(entry);
        return convertToDTO(savedEntry);
    }

    public ListEntryDTO updateEntry(Long entryId, ListEntryDTO listEntryDTO) {
        ListEntry existingEntry = listEntryDataPool.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Entry not found with id: " + entryId));

        existingEntry.setEntryName(listEntryDTO.getEntryName());
        if (listEntryDTO.getIsChecked() != null) {
            existingEntry.setIsChecked(listEntryDTO.getIsChecked());
        }
        existingEntry.setDueDate(listEntryDTO.getDueDate());
        existingEntry.setWarningThreshold(listEntryDTO.getWarningThreshold());

        ListEntry updatedEntry = listEntryDataPool.save(existingEntry);
        return convertToDTO(updatedEntry);
    }

    public void deleteEntry(Long entryId)
    {
        if (!listEntryDataPool.existsById(entryId))
        {
            throw new RuntimeException("Entry not found with id: " + entryId);
        }
        listEntryDataPool.deleteById(entryId);
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

    private ListEntryDTO convertToDTO(ListEntry entry)
    {
        ListEntryDTO dto = new ListEntryDTO();
        dto.setEntryId(entry.getEntryId());
        dto.setEntryName(entry.getEntryName());
        dto.setIsChecked(entry.getIsChecked());
        dto.setDueDate(entry.getDueDate());
        dto.setWarningThreshold(entry.getWarningThreshold());

        //need to include assigned users/teams here

        return dto;
    }
}
