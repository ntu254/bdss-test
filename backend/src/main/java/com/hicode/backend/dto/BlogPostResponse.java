package com.hicode.backend.dto;

import com.hicode.backend.model.enums.BlogPostStatus;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class BlogPostResponse {
    private Long id;
    private String title;
    private String content;
    private UserResponse author;
    private BlogPostStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}