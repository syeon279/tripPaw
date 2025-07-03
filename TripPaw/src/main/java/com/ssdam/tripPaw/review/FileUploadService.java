package com.ssdam.tripPaw.review;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileUploadService {
	private final Path rootLocation = Paths.get("upload/reviews"); // 상대 경로 or 절대 경로

    public FileUploadService() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("업로드 폴더 생성 실패", e);
        }
    }

    public String upload(MultipartFile file) {
        try {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), this.rootLocation.resolve(filename));
            return "/upload/reviews/" + filename;
        } catch (Exception e) {
            throw new RuntimeException("파일 저장 실패", e);
        }
    }
    
    public void delete(String imageUrl) {
    	String fileName = extractFileNameFromUrl(imageUrl);
        try {
            Path filePath = this.rootLocation.resolve(fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("파일 삭제 실패: " + fileName, e);
        }
    }
    
    public String extractFileNameFromUrl(String imageUrl) {
        // 예: "/upload/reviews/uuid_filename.jpg" → "uuid_filename.jpg"
        return Paths.get(imageUrl).getFileName().toString();
    }
    
    
}
