package com.ssdam.tripPaw.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration("appWebConfig")
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 외부 디렉토리: C:/upload/reviews/
        String uploadPath = Paths.get("C:/upload/reviews").toFile().getAbsolutePath();

        // 실제 요청 경로: http://localhost:8080/upload/reviews/파일명
        registry.addResourceHandler("/upload/reviews/**")
                .addResourceLocations("file:///" + uploadPath + "/");
    }
}
