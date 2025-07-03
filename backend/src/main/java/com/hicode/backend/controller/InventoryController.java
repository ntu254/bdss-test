package com.hicode.backend.controller;

import com.hicode.backend.dto.admin.BloodUnitResponse;
import com.hicode.backend.dto.admin.InventorySummary;
import com.hicode.backend.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<BloodUnitResponse>> viewInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    // --- CÁC ENDPOINT MỚI ---

    @GetMapping("/summary")
    public ResponseEntity<List<InventorySummary>> getSummary() {
        return ResponseEntity.ok(inventoryService.getInventorySummary());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<BloodUnitResponse>> getRecentAdditions() {
        return ResponseEntity.ok(inventoryService.getRecentAdditions());
    }
}