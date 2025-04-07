package com.backend.PlanWise.servicer;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.PlanWise.DataPool.CategoryDataPool;
import com.backend.PlanWise.DataPool.ListEntryDataPool;
import com.backend.PlanWise.DataPool.TaskListDataPool;
import com.backend.PlanWise.DataTransferObjects.ListEntryDTO;
import com.backend.PlanWise.DataTransferObjects.TaskListDTO;
import com.backend.PlanWise.model.Category;
import com.backend.PlanWise.model.ListEntry;
import com.backend.PlanWise.model.TaskList;

import jakarta.transaction.Transactional;

@Service
public class TaskListService
{
    @Autowired
    private TaskListDataPool taskListDataPool;

    @Autowired
    private ListEntryDataPool listEntryDataPool;

    @Autowired
    private CategoryDataPool categoryDataPool;

    @Autowired
    private ListEntryService listEntryService;

    @Autowired
    private RecentActivityService recentActivityService;

    public List<ListEntryDTO> getListEntriesByTaskListId(Long taskListId) {
        List<ListEntry> listEntries = listEntryDataPool.findByTaskListTaskListId(taskListId);
        return listEntries.stream().map(entry -> {
            ListEntryDTO entryDTO = new ListEntryDTO();
            entryDTO.setEntryId(entry.getEntryId());
            entryDTO.setEntryName(entry.getEntryName());
            entryDTO.setIsChecked(entry.getIsChecked());
            entryDTO.setDueDate(entry.getDueDate());
            if(entry.getDueDate() != null)
                entryDTO.setWarningThreshold(entry.getWarningThreshold());
            else
                entryDTO.setWarningThreshold(null);

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

        recentActivityService.createSystemActivity(
        category.getProject().getProjectId(), // Get projectId from category
        "CREATE",
        "TASKLIST",
        savedTaskList.getTaskListId(),
        savedTaskList.getTaskListName()
    );

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

        TaskList updatedTaskList = taskListDataPool.save(existingTaskList);

        recentActivityService.createSystemActivity(
        updatedTaskList.getCategory().getProject().getProjectId(),
        "UPDATE",
        "TASKLIST",
        updatedTaskList.getTaskListId(),
        updatedTaskList.getTaskListName()
    );

        return convertToDTO(updatedTaskList);
    }

    @Transactional
    public void deleteTaskList(Long taskListId)
    {
        TaskList taskList = taskListDataPool.findById(taskListId)
            .orElseThrow(() -> new RuntimeException("TaskList not found"));
        recentActivityService.createSystemActivity(
        taskList.getCategory().getProject().getProjectId(),
        "DELETE",
        "TASKLIST",
        taskListId,
        taskList.getTaskListName()
    );

        listEntryService.deleteAllEntriesInTaskList(taskListId);
        taskListDataPool.deleteById(taskListId);
    }
}
