package com.hicode.backend.dto.admin;

import com.hicode.backend.model.enums.DonationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateDonationStatusRequest {
    @NotNull
    private DonationStatus newStatus;
    private String note;
}