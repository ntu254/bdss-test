package com.hicode.backend.controller;

import com.hicode.backend.dto.LocationSearchRequest;
import com.hicode.backend.dto.UpdateUserRequest;
import com.hicode.backend.dto.UserResponse;
import com.hicode.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> getCurrentUserProfile() {
        return ResponseEntity.ok(userService.getUserProfile());
    }

    @PutMapping("/me/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> updateUserProfile(@Valid @RequestBody UpdateUserRequest updateUserRequest) {
        return ResponseEntity.ok(userService.updateUserProfile(updateUserRequest));
    }

    @PostMapping("/search/donors-by-location")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserResponse>> searchDonorsByLocation(@Valid @RequestBody LocationSearchRequest request) {
        List<UserResponse> donors = userService.searchDonorsByLocation(request);
        return ResponseEntity.ok(donors);
    }
}