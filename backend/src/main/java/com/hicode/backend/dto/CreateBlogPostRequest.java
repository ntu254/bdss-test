package com.hicode.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateBlogPostRequest {
    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 255)
    private String title;

    @NotBlank(message = "Content is required")
    @Size(min = 50)
    private String content;
}