package com.ssdam.tripPaw.member;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")  // 쿠키 허용
@RestController
@RequiredArgsConstructor
public class ChatGPTApiController {
	private final ChatGPTService chatGPTService;
	
	@GetMapping("/api/chatGPT")
	public ResponseEntity<String> chatGPT(){
		String message = "";
		return chatGPTService.chat(message);
	}
	
}
