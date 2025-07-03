package com.hicode.backend.controller;

import com.hicode.backend.dto.admin.*;
import com.hicode.backend.service.BloodManagementService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff")
@PreAuthorize("hasRole('STAFF')")
public class StaffBloodManagementController {

    @Autowired
    private BloodManagementService bloodManagementService;

    // == Blood Type Management ==
    @PutMapping("/blood-types/{id}")
    public ResponseEntity<BloodTypeResponse> updateBloodType(@PathVariable Integer id, @Valid @RequestBody UpdateBloodTypeRequest request) {
        return ResponseEntity.ok(bloodManagementService.updateBloodType(id, request));
    }

    // == Blood Compatibility Management ==
    @GetMapping("/blood-compatibility")
    public ResponseEntity<Page<BloodCompatibilityDetailResponse>> getAllCompatibilityRules(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String[] sort) {

        Sort.Direction direction = sort.length > 1 && sort[1].equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortField = sort.length > 0 ? sort[0] : "id";
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        return ResponseEntity.ok(bloodManagementService.getAllCompatibilityRules(pageable));
    }

    @GetMapping("/blood-compatibility/{id}")
    public ResponseEntity<BloodCompatibilityDetailResponse> getCompatibilityRuleById(@PathVariable Integer id) {
        return ResponseEntity.ok(bloodManagementService.getCompatibilityRuleById(id));
    }
}