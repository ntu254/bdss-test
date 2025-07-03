package com.hicode.backend.repository;

import com.hicode.backend.model.entity.BlogPost;
import com.hicode.backend.model.enums.BlogPostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {

    // Tìm các bài viết đã xuất bản để hiển thị công khai
    Page<BlogPost> findByStatus(BlogPostStatus status, Pageable pageable);

    // Tìm các bài viết của một tác giả cụ thể
    Page<BlogPost> findByAuthorId(Long authorId, Pageable pageable);
}