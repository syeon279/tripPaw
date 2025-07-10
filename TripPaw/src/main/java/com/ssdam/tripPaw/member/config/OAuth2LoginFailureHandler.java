package com.ssdam.tripPaw.member.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@Component
public class OAuth2LoginFailureHandler implements AuthenticationFailureHandler {
    
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        
        // 1. 어떤 에러 때문에 로그인에 실패했는지 로그를 찍습니다. (가장 중요)
        log.error("### 소셜 로그인에 실패했습니다. 에러 메시지 : {}", exception.getMessage());
        exception.printStackTrace(); // 전체 에러 내용을 확인하고 싶을 때

        // 2. 실패 시 사용자를 보낼 프론트엔드의 URL을 만듭니다.
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/member/login")
                .queryParam("error", "social_login_failed")
                .build().toUriString();

        // 3. 만든 URL로 리다이렉트시킵니다.
        response.sendRedirect(targetUrl);
    }
}