package com.ssdam.tripPaw.chatting.chat;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.ssdam.tripPaw.domain.ChatMessage;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatController {
	
	private final SimpMessagingTemplate messagingTemplate;
	private final ChatService chatService;
	
	@GetMapping("/chat")
	public String chat() {
		return "chat";
	}

	// 클라이언트가 "/app/chat.sendMessage"로 메시지를 보내면 이 메서드가 처리됩니다.
    // @SendTo("/topic/public")은 처리된 메시지를 "/topic/public"을 구독하는 모든 클라이언트에게 브로드캐스트합니다.
    //@MessageMapping("/chat.sendMessage")
    //@SendTo("/topic/public")
	@MessageMapping("/chat/{roomId}/sendMessage")
    public void sendMessage(@DestinationVariable Long roomId,@Payload ChatMessage chatMessage) {
    	System.out.println("chat="+chatMessage.getContent());
    	chatService.chatSave(roomId, chatMessage);
    	messagingTemplate.convertAndSend("/topic/chat/" + roomId, chatMessage);
        //return chatMessage;
    }

    // 클라이언트가 "/app/chat.addUser"로 메시지를 보내면 이 메서드가 처리됩니다.
    // 새로운 사용자가 채팅방에 입장했을 때 사용자 이름을 세션에 추가하고, 입장 메시지를 브로드캐스트합니다.
    //@MessageMapping("/chat.addUser")
    //@SendTo("/topic/public")
	@MessageMapping("/chat/{roomId}/addUser")
	public void addUser(@DestinationVariable String roomId,@Payload ChatMessage chatMessage,
                               SimpMessageHeaderAccessor headerAccessor) {
        // WebSocket 세션에 사용자 이름 저장 (나중에 사용자 연결 해제 시 유용)
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        headerAccessor.getSessionAttributes().put("roomId", roomId);
        
        messagingTemplate.convertAndSend("/topic/chat/"+roomId,chatMessage);
        //return chatMessage;
    }
}
