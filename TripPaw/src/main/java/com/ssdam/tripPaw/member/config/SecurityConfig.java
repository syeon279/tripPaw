package com.ssdam.tripPaw.member.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // <= 이거 추가
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // CSRF 보호 비활성화 (WebSocket과 함께 사용할 때 필요할 수 있음)
            .authorizeHttpRequests(authz -> authz
                .antMatchers("/**").permitAll() // "/**"는 모든 경로를 의미합니다.
                .antMatchers("/admin/**").hasRole("ADMIN") // 관리자만 접근 가능 <= 이거 추가
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
