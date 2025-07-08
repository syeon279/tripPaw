package com.ssdam.tripPaw.member.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class EncoderConfig {
	@Bean // @Bean 스프링이 관리하는 객체 
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
		//return new Argon2PasswordEncoder(); 
	}
} 

//순환참조 예제
