package com.hicode.backend.model.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_checks")
@Getter
@Setter
@NoArgsConstructor
public class HealthCheck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "process_id", nullable = false, unique = true)
    @JsonBackReference("process-healthcheck") // <-- THÊM ANNOTATION NÀY
    private DonationProcess donationProcess;

    @Column(nullable = false)
    private Boolean isEligible; // True = Đạt tiêu chuẩn, False = Không đạt

    private Integer bloodPressureSystolic; // Huyết áp tâm thu
    private Integer bloodPressureDiastolic; // Huyết áp tâm trương
    private Double hemoglobinLevel; // Nồng độ hemoglobin

    private Double weight; // Cân nặng (kg)
    private Integer heartRate; // Nhịp tim (bpm)
    private Double temperature; // Nhiệt độ (°C)

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String notes; // Ghi chú của nhân viên y tế

    @Column(updatable = false)
    private LocalDateTime checkDate;

    @PrePersist
    protected void onPrePersist() {
        this.checkDate = LocalDateTime.now();
    }
}