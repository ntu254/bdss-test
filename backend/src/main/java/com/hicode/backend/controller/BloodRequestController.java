package com.hicode.backend.controller;

import com.hicode.backend.dto.admin.BloodRequestResponse;
import com.hicode.backend.dto.admin.CreateBloodRequestRequest;
import com.hicode.backend.model.entity.DonationPledge;
import com.hicode.backend.model.enums.RequestStatus;
import com.hicode.backend.service.BloodRequestService;
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
import java.util.List;

@RestController
@RequestMapping("/api/blood-requests")
public class BloodRequestController {

    @Autowired
    private BloodRequestService bloodRequestService;

    @PostMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<BloodRequestResponse> createRequest(@Valid @RequestBody CreateBloodRequestRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bloodRequestService.createRequest(request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<Page<BloodRequestResponse>> getAllRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(bloodRequestService.getAllRequests(pageable));
    }

    @GetMapping("/search/active")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<BloodRequestResponse>> searchActiveRequests() {
        return ResponseEntity.ok(bloodRequestService.searchActiveRequests());
    }

    @GetMapping("/search/completed")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<Page<BloodRequestResponse>> getCompletedRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(bloodRequestService.getCompletedRequests(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BloodRequestResponse> getRequestDetails(@PathVariable Long id) {
        return ResponseEntity.ok(bloodRequestService.getRequestById(id));
    }

    @PostMapping("/{requestId}/pledge")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DonationPledge> pledgeToDonate(@PathVariable Long requestId) {
        DonationPledge pledge = bloodRequestService.pledgeForRequest(requestId);
        return ResponseEntity.status(HttpStatus.CREATED).body(pledge);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<BloodRequestResponse> updateRequestStatus(
            @PathVariable Long id,
            @RequestParam RequestStatus newStatus) {
        return ResponseEntity.ok(bloodRequestService.updateStatus(id, newStatus));
    }
}