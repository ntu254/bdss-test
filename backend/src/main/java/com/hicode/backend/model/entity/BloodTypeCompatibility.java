package com.hicode.backend.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "blood_type_compatibility")
@Getter
@Setter
@NoArgsConstructor
public class BloodTypeCompatibility {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_blood_type_id", nullable = false)
    private BloodType donorBloodType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_blood_type_id", nullable = false)
    private BloodType recipientBloodType;

    @Column(nullable = false)
    private Boolean isCompatible;

    @Lob
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String notes;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = this.updatedAt = LocalDateTime.now();
    }
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
