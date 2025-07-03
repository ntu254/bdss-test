package com.hicode.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class AddressEntitiesDTO {
    private String province;
    private String district;
    private String ward;
    private String street;
}