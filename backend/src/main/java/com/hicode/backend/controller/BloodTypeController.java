package com.hicode.backend.controller;

import com.hicode.backend.dto.admin.BloodTypeResponse;
import com.hicode.backend.dto.admin.CreateBloodTypeRequest;
import com.hicode.backend.dto.admin.UpdateBloodTypeRequest;
import com.hicode.backend.dto.UserResponse;
import com.hicode.backend.service.BloodManagementService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/blood-types")
public class BloodTypeController {

    @Autowired
    private BloodManagementService bloodManagementService;

    @GetMapping
    public ResponseEntity<List<BloodTypeResponse>> getAllBloodTypes() {
        return ResponseEntity.ok(bloodManagementService.getAllBloodTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BloodTypeResponse> getBloodTypeById(@PathVariable Integer id) {
        return ResponseEntity.ok(bloodManagementService.getBloodTypeDetails(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BloodTypeResponse> createBloodType(@Valid @RequestBody CreateBloodTypeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bloodManagementService.createBloodType(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<BloodTypeResponse> updateBloodType(@PathVariable Integer id, @Valid @RequestBody UpdateBloodTypeRequest request) {
        return ResponseEntity.ok(bloodManagementService.updateBloodType(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBloodType(@PathVariable Integer id) {
        bloodManagementService.deleteBloodType(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/users")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserResponse>> getUsersByBloodType(@PathVariable Integer id) {
        List<UserResponse> users = bloodManagementService.findUsersByBloodTypeId(id);
        return ResponseEntity.ok(users);
    }
}