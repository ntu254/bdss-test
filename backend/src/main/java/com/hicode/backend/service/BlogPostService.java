package com.hicode.backend.service;

import com.hicode.backend.dto.BlogPostResponse;
import com.hicode.backend.dto.CreateBlogPostRequest;
import com.hicode.backend.dto.UpdateBlogPostRequest;
import com.hicode.backend.model.entity.BlogPost;
import com.hicode.backend.model.enums.BlogPostStatus;
import com.hicode.backend.model.entity.User;
import com.hicode.backend.repository.BlogPostRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Objects;

@Service
public class BlogPostService {

    @Autowired
    private BlogPostRepository blogPostRepository;
    @Autowired
    private UserService userService;

    // Lấy tất cả bài viết đã xuất bản (công khai)
    public Page<BlogPostResponse> getAllPublishedPosts(Pageable pageable) {
        Page<BlogPost> posts = blogPostRepository.findByStatus(BlogPostStatus.PUBLISHED, pageable);
        return posts.map(this::mapToResponse);
    }

    // Lấy một bài viết theo ID (công khai)
    public BlogPostResponse getPostById(Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Blog post not found with id: " + id));

        // Chỉ cho phép xem nếu bài viết đã được PUBLISHED, hoặc nếu người xem là tác giả hoặc admin/staff
        User currentUser = null;
        try {
            currentUser = userService.getCurrentUser();
        } catch (IllegalStateException e) {
            // User is not authenticated (guest)
        }

        if (post.getStatus() != BlogPostStatus.PUBLISHED) {
            if (currentUser == null || (!Objects.equals(post.getAuthor().getId(), currentUser.getId()) && !currentUser.getRole().getName().equals("Admin") && !currentUser.getRole().getName().equals("Staff"))) {
                throw new AccessDeniedException("You are not authorized to view this post.");
            }
        }

        return mapToResponse(post);
    }

    // Lấy tất cả bài viết của user đang đăng nhập
    public Page<BlogPostResponse> getMyPosts(Pageable pageable) {
        User currentUser = userService.getCurrentUser();
        Page<BlogPost> posts = blogPostRepository.findByAuthorId(currentUser.getId(), pageable);
        return posts.map(this::mapToResponse);
    }

    // Tạo bài viết mới
    @Transactional
    public BlogPostResponse createPost(CreateBlogPostRequest request) {
        User currentUser = userService.getCurrentUser();
        BlogPost post = new BlogPost();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setAuthor(currentUser);

        // Kiểm tra vai trò để quyết định trạng thái bài viết
        String userRole = currentUser.getRole().getName();
        if (userRole.equals("Admin") || userRole.equals("Staff")) {
            post.setStatus(BlogPostStatus.PUBLISHED);
        } else {
            post.setStatus(BlogPostStatus.PENDING_APPROVAL);
        }

        BlogPost savedPost = blogPostRepository.save(post);
        return mapToResponse(savedPost);
    }

    // Cập nhật bài viết
    @Transactional
    public BlogPostResponse updatePost(Long postId, UpdateBlogPostRequest request) {
        User currentUser = userService.getCurrentUser();
        BlogPost post = blogPostRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Blog post not found with id: " + postId));

        // Chỉ tác giả mới được sửa bài viết
        if (!Objects.equals(post.getAuthor().getId(), currentUser.getId())) {
            throw new AccessDeniedException("You are not authorized to update this post.");
        }

        if (request.getTitle() != null) {
            post.setTitle(request.getTitle());
        }
        if (request.getContent() != null) {
            post.setContent(request.getContent());
        }

        BlogPost updatedPost = blogPostRepository.save(post);
        return mapToResponse(updatedPost);
    }

    // Xóa bài viết
    @Transactional
    public void deletePost(Long postId) {
        User currentUser = userService.getCurrentUser();
        BlogPost post = blogPostRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Blog post not found with id: " + postId));

        // Chỉ tác giả hoặc Admin mới được xóa
        boolean isAuthor = Objects.equals(post.getAuthor().getId(), currentUser.getId());
        boolean isAdmin = currentUser.getRole().getName().equals("Admin");

        if (!isAuthor && !isAdmin) {
            throw new AccessDeniedException("You are not authorized to delete this post.");
        }

        blogPostRepository.delete(post);
    }

    // Lấy danh sách các bài viết đang chờ duyệt
    public Page<BlogPostResponse> getPendingPosts(Pageable pageable) {
        Page<BlogPost> posts = blogPostRepository.findByStatus(BlogPostStatus.PENDING_APPROVAL, pageable);
        return posts.map(this::mapToResponse);
    }

    // Duyệt một bài viết
    @Transactional
    public BlogPostResponse approvePost(Long postId) {
        BlogPost post = blogPostRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Blog post not found with id: " + postId));

        if (post.getStatus() != BlogPostStatus.PENDING_APPROVAL) {
            throw new IllegalStateException("This post is not pending approval.");
        }

        post.setStatus(BlogPostStatus.PUBLISHED);
        BlogPost approvedPost = blogPostRepository.save(post);
        return mapToResponse(approvedPost);
    }

    // Hàm helper để map Entity sang DTO
    private BlogPostResponse mapToResponse(BlogPost post) {
        BlogPostResponse response = new BlogPostResponse();
        BeanUtils.copyProperties(post, response, "author");
        if (post.getAuthor() != null) {
            response.setAuthor(userService.mapToUserResponse(post.getAuthor()));
        }
        return response;
    }
}