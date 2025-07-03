package com.hicode.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class StorageService {

    private final Path rootLocation;

    public StorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir).normalize().toAbsolutePath();
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage location", e);
        }
    }

    public String store(MultipartFile file) {
        // Lấy tên file gốc từ client
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            if (file.isEmpty()) {
                throw new IllegalArgumentException("Failed to store empty file.");
            }
            // Kiểm tra xem tên file có chứa ký tự nguy hiểm không
            if (originalFilename.contains("..")) {
                throw new SecurityException("Cannot store file with relative path outside current directory " + originalFilename);
            }

            // Tạo một tên file ngẫu nhiên và an toàn
            String filename = UUID.randomUUID().toString() + "_" + originalFilename;

            // Tạo đường dẫn đầy đủ đến file đích
            Path destinationFile = this.rootLocation.resolve(filename);

            // Ghi file vào vị trí đích
            Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);

            // Trả về chỉ tên file để lưu vào DB
            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file.", e);
        }
    }
}