package com.hicode.backend.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import com.hicode.backend.model.enums.InventoryStatus;

@Entity
@Table(name = "blood_units")
@Getter
@Setter
@NoArgsConstructor
public class BloodUnit {

    @Id
    @Column(length = 50)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "process_id", nullable = false, unique = true)
    private DonationProcess donationProcess;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blood_type_id", nullable = false)
    private BloodType bloodType;

    @Column(nullable = false)
    private Integer volumeMl;

    @Column(nullable = false)
    private LocalDate collectionDate;

    @Column(nullable = false)
    private LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private InventoryStatus status;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String storageLocation;
}