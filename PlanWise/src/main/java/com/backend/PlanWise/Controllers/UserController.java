package com.backend.PlanWise.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.PlanWise.DataTransferObjects.UserDTO;
import com.backend.PlanWise.servicer.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/sync")
    public ResponseEntity<UserDTO> syncUserData(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.syncUserData(userDTO));
    }
}