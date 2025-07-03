package com.hicode.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class FptOcrResponse {
    private List<OcrDataDTO> data;
    private int errorCode;
    private String errorMessage;
}