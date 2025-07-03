package com.hicode.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class OcrDataDTO {
    private String id;
    private String name;
    private String dob;
    private String home;
    private String address;
    private String sex;
    private String nationality;
    private String doe; // Date of Expiry
    private String features;
    @JsonProperty("issue_date")
    private String issueDate;
    @JsonProperty("issue_loc")
    private String issueLoc;
    private String type;

    @JsonProperty("address_entities")
    private AddressEntitiesDTO addressEntities;
}