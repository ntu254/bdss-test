package com.hicode.backend.controller;

import com.hicode.backend.dto.admin.BloodCompatibilityDetailResponse;
import com.hicode.backend.dto.admin.CreateBloodCompatibilityRequest;
import com.hicode.backend.dto.admin.UpdateBloodCompatibilityRequest;
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
@RequestMapping("/api/blood-compatibility")
public class BloodCompatibilityController {

    @Autowired
    private BloodManagementService bloodManagementService;

    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<Page<BloodCompatibilityDetailResponse>> getAllCompatibilityRules(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String[] sort) {

        Sort.Direction direction = sort.length > 1 && sort[1].equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortField = sort.length > 0 ? sort[0] : "id";
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        return ResponseEntity.ok(bloodManagementService.getAllCompatibilityRules(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<BloodCompatibilityDetailResponse> getCompatibilityRuleById(@PathVariable Integer id) {
        return ResponseEntity.ok(bloodManagementService.getCompatibilityRuleById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BloodCompatibilityDetailResponse> createCompatibilityRule(@Valid @RequestBody CreateBloodCompatibilityRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bloodManagementService.createCompatibilityRule(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BloodCompatibilityDetailResponse> updateCompatibilityRule(@PathVariable Integer id, @Valid @RequestBody UpdateBloodCompatibilityRequest request) {
        return ResponseEntity.ok(bloodManagementService.updateCompatibilityRule(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCompatibilityRule(@PathVariable Integer id) {
        bloodManagementService.deleteCompatibilityRule(id);
        return ResponseEntity.noContent().build();
    }
}