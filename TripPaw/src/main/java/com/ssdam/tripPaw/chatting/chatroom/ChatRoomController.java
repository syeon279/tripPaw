package com.ssdam.tripPaw.chatting.chatroom;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.ssdam.tripPaw.chatting.chatRoomMember.ChatRoomMemberService;
import com.ssdam.tripPaw.chatting.chatRoomMember.ChatRoomMemberStatus;
import com.ssdam.tripPaw.domain.ChatRoom;
import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.member.MemberService;
import com.ssdam.tripPaw.member.config.ChatRole;
import com.ssdam.tripPaw.member.util.JwtProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/chat")
public class ChatRoomController {
	private final ChatRoomRepository chatRoomRepository;
	private final ChatRoomService chatRoomService;
	private final ChatRoomMemberService chatRoomMemberService;
	
	private final MemberService memberService;
	
	private final JwtProvider jwtProvider;
	 @GetMapping("/room/{id}")
	    public ResponseEntity<?> roomEnter(@PathVariable Long id, Model model) {
	        log.info("채팅방 입장 요청. Room ID: {}", id);

	        // roomId로 채팅방 정보를 찾습니다.
	        ChatRoom room = chatRoomService.findRoomById(id);
	        System.out.println("room입장:"+(room==null));
	        // 만약 존재하지 않는 방이라면, 목록 페이지로 돌려보냅니다.
	        if (room==null) {
//	            log.warn("존재하지 않는 채팅방입니다. Room ID: {}", id);
//	            return "redirect:/chat/rooms";
	        	return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "존재하지 않는 채팅방입니다."));
	        }

	        // JSP에 방 정보를 전달합니다.
	        model.addAttribute("room", room);
	        
	        // 사용자가 닉네임을 입력하고 채팅을 시작할 페이지를 반환합니다.
	        //return "room"; // /WEB-INF/views/room.jsp
	        return ResponseEntity.ok(room);
	    }
	
	
	@GetMapping("/rooms")
	public ResponseEntity<?> room(Model model, HttpServletRequest request,@CookieValue(value = "jwt", required = false) String token){
		if (token == null || jwtProvider.isExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            					.body(Map.of("error", "로그인이 필요합니다."));
			
        }
		//model.addAttribute("rooms",chatRoomService.chatRoomList());
		 List<ChatRoom> roomList = chatRoomService.chatRoomList();
		model.addAttribute("ChatRoomForm",new ChatRoomForm());
		//Map<String, String> token = (Map<String, String>) model.getAttribute("token");
	    System.out.println("roomsToken=" + token);
		//return "room-list";
	    return ResponseEntity.ok(roomList);
	}
	
	@PostMapping("/rooms")
	public ResponseEntity<?> createRoom(@CookieValue(value = "jwt", required = false) String token ,@RequestBody ChatRoomForm chatRoomForm, RedirectAttributes redirectAttributes) {
		  if (token == null || jwtProvider.isExpired(token)) {
	            // 토큰이 없거나 만료되었으면 401 Unauthorized 응답
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	        }
		String username = jwtProvider.getUsername(token);
		Member member = memberService.findByUsername(username);
		
		ChatRoom chatRoom = new ChatRoom();
		System.out.println("chatRoomForm="+chatRoomForm.getTitle());
		chatRoom.setTitle(chatRoomForm.getTitle());
		chatRoom.setDescription("");
		chatRoom.setIsGroup(1);
		ChatRoom createRoom = chatRoomService.createChatRoom(chatRoom);
		System.out.println("createRoom="+createRoom.getId());
		
		chatRoomMemberService.insertChatRoomMember(member,chatRoom,ChatRole.ADMIN,ChatRoomMemberStatus.ACTIVE);
		//return "redirect:/chat/rooms";
		return ResponseEntity.ok().body(Map.of(
	            "message", "chatRoom생성 성공"
	        ));
	}
	
}
