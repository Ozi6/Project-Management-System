package com.backend.PlanWise.servicer;

import com.backend.PlanWise.DataPool.CategoryDataPool;
import com.backend.PlanWise.DataPool.ListEntryDataPool;
import com.backend.PlanWise.DataPool.TaskListDataPool;
import com.backend.PlanWise.DataTransferObjects.ListEntryDTO;
import com.backend.PlanWise.DataTransferObjects.TaskListDTO;
import com.backend.PlanWise.model.Category;
import com.backend.PlanWise.model.ListEntry;
import com.backend.PlanWise.model.TaskList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskListService
{
    @Autowired
    private TaskListDataPool taskListDataPool;

    @Autowired
    private ListEntryDataPool listEntryDataPool;

    @Autowired
    private CategoryDataPool categoryDataPool;

    public List<ListEntryDTO> getListEntriesByTaskListId(Long taskListId) {
        List<ListEntry> listEntries = listEntryDataPool.findByTaskListTaskListId(taskListId);
        return listEntries.stream().map(entry -> {
            ListEntryDTO entryDTO = new ListEntryDTO();
            entryDTO.setEntryId(entry.getEntryId());
            entryDTO.setEntryName(entry.getEntryName());
            entryDTO.setIsChecked(entry.getIsChecked());
            entryDTO.setDueDate(entry.getDueDate());
            entryDTO.setWarningThreshold(entry.getWarningThreshold());

            return entryDTO;
        }).collect(Collectors.toList());
    }

    public TaskListDTO createTaskList(TaskListDTO taskListDTO, Long categoryId)
    {
        Category category = categoryDataPool.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));

        TaskList taskList = new TaskList();
        taskList.setTaskListName(taskListDTO.getTaskListName());
        taskList.setColor(taskListDTO.getColor());
        taskList.setCategory(category);

        TaskList savedTaskList = taskListDataPool.save(taskList);
        return convertToDTO(savedTaskList);
    }

    private TaskListDTO convertToDTO(TaskList taskList)
    {
        TaskListDTO dto = new TaskListDTO();
        dto.setTaskListId(taskList.getTaskListId());
        dto.setTaskListName(taskList.getTaskListName());
        dto.setColor(taskList.getColor());
        return dto;
    }

    public TaskListDTO updateTaskList(Long taskListId, TaskListDTO taskListDTO)
    {
        TaskList existingTaskList = taskListDataPool.findById(taskListId)
                .orElseThrow(() -> new RuntimeException("TaskList not found with id: " + taskListId));

        existingTaskList.setTaskListName(taskListDTO.getTaskListName());
        existingTaskList.setColor(taskListDTO.getColor());

        TaskList updatedTaskList = taskListDataPool.save(existingTaskList);
        return convertToDTO(updatedTaskList);
    }
}
