package com.hicode.backend.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateBlogPostRequest {
    @Size(min = 5, max = 255)
    private String title;

    @Size(min = 50)
    private String content;
}