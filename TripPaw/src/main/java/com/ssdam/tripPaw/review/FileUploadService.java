package com.ssdam.tripPaw.review;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.Objects;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileUploadService {

    private final Path rootLocation;

    public FileUploadService(@Value("${file.upload.dir:C:/upload/reviews}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir).normalize();
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("업로드 폴더 생성 실패", e);
        }
    }

    public String upload(MultipartFile file) {
        try {
            String originalFilename = Objects.requireNonNull(file.getOriginalFilename(), "파일명이 없습니다.");
            String safeFilename = UUID.randomUUID() + "_" + Paths.get(originalFilename).getFileName().toString();
            Path destinationFile = this.rootLocation.resolve(safeFilename).normalize();

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            return destinationFile.toString().replace("\\", "/"); // 윈도우 경로 → URL 호환
        } catch (Exception e) {
            throw new RuntimeException("파일 저장 실패", e);
        }
    }

    public void delete(String imageUrl) {
        String fileName = extractFileNameFromUrl(imageUrl);
        try {
            Path filePath = this.rootLocation.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("파일 삭제 실패: " + fileName, e);
        }
    }

    public String extractFileNameFromUrl(String imageUrl) {
        return Paths.get(imageUrl).getFileName().toString();
    }
}
