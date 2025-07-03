package com.hicode.backend.model.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.hicode.backend.model.enums.DonationStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "donation_processes")
@Getter
@Setter
@NoArgsConstructor
public class DonationProcess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id", nullable = false)
    @JsonBackReference("user-donation")
    private User donor;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private DonationStatus status;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String note;

    private Integer collectedVolumeMl;

    @OneToOne(mappedBy = "donationProcess", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("process-appointment")
    private DonationAppointment donationAppointment;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "donationProcess", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("process-healthcheck")
    private HealthCheck healthCheck;

    @PrePersist
    protected void onCreate() { this.createdAt = this.updatedAt = LocalDateTime.now(); }
    @PreUpdate
    protected void onUpdate() { this.updatedAt = LocalDateTime.now(); }
}
