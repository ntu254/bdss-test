package com.hicode.backend.dto.admin;

import com.hicode.backend.model.enums.InventoryStatus;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class BloodUnitResponse {
    private String id;
    private BloodTypeResponse bloodType;
    private Integer volumeMl;
    private LocalDate collectionDate;
    private LocalDate expiryDate;
    private InventoryStatus status;
    private String storageLocation;
    private Long donorId;
    private String donorName;
}