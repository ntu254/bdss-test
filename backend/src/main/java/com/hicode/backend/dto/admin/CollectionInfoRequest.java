package com.hicode.backend.dto.admin;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CollectionInfoRequest {
    @NotNull(message = "Collected volume is required")
    @Positive(message = "Volume must be positive")
    private Integer collectedVolumeMl;
}