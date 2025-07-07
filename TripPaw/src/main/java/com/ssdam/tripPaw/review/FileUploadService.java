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

            return destinationFile.getFileName().toString(); // ✅ 파일명만 리턴됨
        } catch (Exception e) {
            throw new RuntimeException("파일 저장 실패", e);
        }
    }

    public void delete(String imageFileName) {
        try {
            Path filePath = this.rootLocation.resolve(imageFileName).normalize();
            Files.deleteIfExists(filePath);
            System.out.println("[INFO] 리뷰 이미지 삭제 성공: " + filePath);
        } catch (IOException e) {
            throw new RuntimeException("파일 삭제 실패: " + imageFileName, e);
        }
    }


    public String extractFileNameFromUrl(String imageUrl) {
        return Paths.get(imageUrl).getFileName().toString();
    }
}
