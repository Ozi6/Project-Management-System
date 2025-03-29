package com.backend.PlanWise.Controllers;

import com.backend.PlanWise.DataTransferObjects.TaskListDTO;
import com.backend.PlanWise.servicer.TaskListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasklists")
public class TaskListController
{

    @Autowired
    private TaskListService taskListService;

    @PostMapping
    public ResponseEntity<TaskListDTO> createTaskList(
            @RequestBody TaskListDTO taskListDTO,
            @RequestParam Long categoryId)
    {
        TaskListDTO createdTaskList = taskListService.createTaskList(taskListDTO, categoryId);
        return ResponseEntity.ok(createdTaskList);
    }
}
