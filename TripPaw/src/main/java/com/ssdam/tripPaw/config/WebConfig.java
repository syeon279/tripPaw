package com.ssdam.tripPaw.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration("appWebConfig")
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 리뷰 이미지 경로
        String reviewPath = Paths.get("C:/upload/reviews").toFile().getAbsolutePath();
        System.out.println("리뷰 이미지 경로: " + reviewPath);  // 디버깅을 위한 출력
        registry.addResourceHandler("/upload/reviews/**")
                .addResourceLocations("file:///" + reviewPath + "/");  // 'file:///' 세 개의 슬래시 사용


        // 뱃지 이미지 경로 추가
        String badgePath = Paths.get("C:/upload/badge").toFile().getAbsolutePath();
        System.out.println("뱃지 이미지 경로: " + badgePath);  // 디버깅을 위한 출력
        registry.addResourceHandler("/upload/badge/**")
                .addResourceLocations("file:///" + badgePath + "/");  // 'file:///' 세 개의 슬래시 사용
        // 멤버 이미지 경로 추가
        String memberPath = Paths.get("C:/upload/memberImg").toFile().getAbsolutePath();
        System.out.println("뱃지 이미지 경로: " + memberPath);  // 디버깅을 위한 출력
        registry.addResourceHandler("/upload/badge/**")
        .addResourceLocations("file:///" + memberPath + "/");  // 'file:///' 세 개의 슬래시 사용
    }
}
