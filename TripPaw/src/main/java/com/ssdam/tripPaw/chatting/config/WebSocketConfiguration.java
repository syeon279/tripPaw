package com.ssdam.tripPaw.chatting.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // WebSocket 메시지 브로커 활성화
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 클라이언트에게 메시지를 보낼 때 사용할 접두사를 정의합니다.
        // 예를 들어, "/topic/public"으로 메시지를 구독하면, 서버에서 이 접두사로 메시지를 보냅니다.
        config.enableSimpleBroker("/topic");
        // 클라이언트에서 서버로 메시지를 보낼 때 사용할 접두사를 정의합니다.
        // 예를 들어, "/app/chat.sendMessage"로 메시지를 전송하면, @MessageMapping("/chat.sendMessage") 어노테이션이 붙은 메서드로 라우팅됩니다.
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // WebSocket 연결을 위한 STOMP 엔드포인트를 등록합니다.
        // 클라이언트는 "/ws" 경로로 WebSocket 연결을 시도합니다.
        // .withSockJS()는 WebSocket을 지원하지 않는 브라우저를 위해 SockJS 폴백 옵션을 추가합니다.
    	registry.addEndpoint("/ws")
        // [수정된 부분]
        // localhost:3000 CORS 요청을 허용하도록 설정합니다.
        .setAllowedOriginPatterns("http://localhost:3000")
        .withSockJS(); // SockJS를 사용하도록 설정
    }
}
