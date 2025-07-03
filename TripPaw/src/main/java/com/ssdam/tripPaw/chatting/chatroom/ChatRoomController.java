package com.ssdam.tripPaw.chatting.chatroom;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.ssdam.tripPaw.domain.ChatRoom;
import com.ssdam.tripPaw.member.util.JwtProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/chat")
public class ChatRoomController {
	private final ChatRoomRepository chatRoomRepository;
	private final ChatRoomService chatRoomService;
	private final JwtProvider jwtProvider;
	 @GetMapping("/room")
	    public String roomEnter(@RequestParam Long id, Model model) {
	        log.info("채팅방 입장 요청. Room ID: {}", id);

	        // roomId로 채팅방 정보를 찾습니다.
	        ChatRoom room = chatRoomService.findRoomById(id);
	        System.out.println("room입장:"+(room==null));
	        // 만약 존재하지 않는 방이라면, 목록 페이지로 돌려보냅니다.
	        if (room==null) {
	            log.warn("존재하지 않는 채팅방입니다. Room ID: {}", id);
	            return "redirect:/chat/rooms";
	        }

	        // JSP에 방 정보를 전달합니다.
	        model.addAttribute("room", room);
	        
	        // 사용자가 닉네임을 입력하고 채팅을 시작할 페이지를 반환합니다.
	        return "room"; // /WEB-INF/views/room.jsp
	    }
	
	
	@GetMapping("/rooms")
	public String room(Model model, HttpServletRequest request,@CookieValue(value = "jwt", required = false) String token){
		if (token == null || jwtProvider.isExpired(token)) {
            //return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "로그인이 필요합니다."));
			
        }
		
		model.addAttribute("rooms",chatRoomService.chatRoomList());
		model.addAttribute("ChatRoomForm",new ChatRoomForm());
		//Map<String, String> token = (Map<String, String>) model.getAttribute("token");
	    System.out.println("roomsToken=" + token);
		return "room-list";
	}
	
	@PostMapping("/rooms")
	public String createRoom(@ModelAttribute("ChatRoomForm") ChatRoomForm chatRoomForm, RedirectAttributes redirectAttributes) {
		ChatRoom chatRoom = new ChatRoom();
		chatRoom.setTitle(chatRoomForm.getTitle());
		//chatRoom.setDescription(chatRoomForm.getDescription());
		chatRoom.setIsGroup(1);
		chatRoomService.createChatRoom(chatRoom);
		return "redirect:/chat/rooms";
	}
	
}
