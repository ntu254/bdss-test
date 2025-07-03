package com.hicode.backend.controller;

import com.hicode.backend.dto.admin.AppointmentResponse;
import com.hicode.backend.dto.admin.CreateAppointmentRequest;
import com.hicode.backend.dto.admin.RescheduleRequest;
import com.hicode.backend.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<AppointmentResponse> createAppointment(@Valid @RequestBody CreateAppointmentRequest request) {
        AppointmentResponse newAppointment = appointmentService.createAppointment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(newAppointment);
    }

    @GetMapping("/my-appointments")
    @PreAuthorize("isAuthenticated()") // Chỉ cần đăng nhập là được
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments() {
        List<AppointmentResponse> appointments = appointmentService.getMyAppointments();
        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/{id}/request-reschedule")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<Void> requestReschedule(
            @PathVariable Long id,
            @Valid @RequestBody RescheduleRequest request) {
        appointmentService.requestReschedule(id, request);
        return ResponseEntity.ok().build();
    }
}