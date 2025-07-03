package com.ssdam.tripPaw.chatting.chat;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class WebSocketHandler extends TextWebSocketHandler{
	
	private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
	
	//웹소켓 연결
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		//소켓 연결
				super.afterConnectionEstablished(session);
				sessions.put(session.getId(), session);
	}
	//양방향 데이터 통신 
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage textMessage) throws Exception {
		//메시지 발송
				String msg = textMessage.getPayload();
				for(String key : sessions.keySet()) {
					WebSocketSession wss = sessions.get(key);
					try {
						wss.sendMessage(new TextMessage(msg));
					}catch(Exception e) {
						e.printStackTrace();
					}
				}
//		WebSocketSession receiver = sessions.get(message.getReceiver());
//		if(receiver != null && receiver.isOpen()) {
//			receiver.sendMessage(new TextMessage(Utils.getString(message)));
//		}
		
//		String receiverId = message.getReceiver();
//
//	    // receiverId가 null이 아닌지 먼저 확인
//	    if (receiverId != null) {
//	        WebSocketSession receiver = sessions.get(receiverId);
//	        if (receiver != null && receiver.isOpen()) {
//	            receiver.sendMessage(new TextMessage(Utils.getString(message)));
//	        }
//	    } else {
//	        // receiver가 지정되지 않은 메시지에 대한 처리 (예: 로그 남기기)
//	        log.warn("수신자가 지정되지 않은 메시지입니다: {}", textMessage.getPayload());
//	    }
	}
	//소켓 연결 종료
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		sessions.remove(session.getId());
		super.afterConnectionClosed(session, status);
	}
	//에러발생
	@Override
	public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
		// TODO Auto-generated method stub
		super.handleTransportError(session, exception);
	}
}
