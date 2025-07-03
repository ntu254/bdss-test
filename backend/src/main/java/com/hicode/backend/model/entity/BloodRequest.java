package com.hicode.backend.model.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.hicode.backend.model.entity.User;
import com.hicode.backend.model.enums.RequestStatus;
import com.hicode.backend.model.enums.UrgencyLevel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "blood_requests")
@Getter
@Setter
@NoArgsConstructor
public class BloodRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String patientName;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String hospital;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blood_type_id", nullable = false)
    private BloodType bloodType;

    @Column(nullable = false)
    private Integer quantityInUnits;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private UrgencyLevel urgency;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private RequestStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_staff_id", nullable = false)
    private User createdBy;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "bloodRequest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("request-pledge")
    private List<DonationPledge> pledges;

    @PrePersist
    protected void onCreate() {
        this.createdAt = this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = RequestStatus.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}