package com.ssdam.tripPaw.member;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssdam.tripPaw.chatting.chatroom.ChatRoomForm;
import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.member.config.MemberLoginForm;
import com.ssdam.tripPaw.member.util.FileUploadUtil;
import com.ssdam.tripPaw.member.util.JwtProvider;
import com.ssdam.tripPaw.member.util.RedisUtil;

import lombok.RequiredArgsConstructor;
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")  // 쿠키 허용
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtProvider jwtProvider;
    private final RedisUtil redisUtil;
    private final MemberService memberService;
    private final FileUploadUtil fileUpload;
    //@Value("${file.upload-dir}")
    private String uploadDir;
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody MemberLoginForm request, Model model, HttpServletResponse response) {
    	System.out.println("로그인 실행");
    	System.out.println("request="+request.getUsername());
    	Member member = memberService.findByUsername(request.getUsername());
        String token = authService.login(request).get("accessToken");
        
        //String tokenInfo = jwtProvider.getAuthentication(token).toString();
        
//        Collection<? extends GrantedAuthority> authorities  = jwtProvider.getAuthentication(token).getAuthorities();
//        boolean isAdmin = authorities.stream().anyMatch(a -> a.getAuthority().equals("ADMIN"));
        String authorities = (String)jwtProvider.getAuthoritie(token);
        System.out.println("authorities권한="+(String)authorities);
        
        //System.out.println("tokenInfo="+tokenInfo);
        //return ResponseEntity.ok(tokens);
        model.addAttribute("ChatRoomForm",new ChatRoomForm());
        //rttr.addFlashAttribute("token", token);
        
        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(false) // 개발 중: http 환경이면 false, 운영에서는 true
                .sameSite("Lax")
                .path("/")
                .maxAge(60 * 60)
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
        
        return ResponseEntity.ok(Map.of("message", "로그인 성공!", 
        		"nickname", member.getNickname(),
        		"role",authorities)); 
        //return "redirect:/chat/rooms";
    }
    
    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody Member request) {
    	System.out.println("member="+request);
        authService.register(request);
        return ResponseEntity.ok("가입이 완료되었습니다.");
    }
    
//    @PostMapping("/logout")
//    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
//        String token = authHeader.replace("Bearer ", "");
//        String username = jwtProvider.getUsername(token);
//
//        redisUtil.deleteRefreshToken(username);
//        return ResponseEntity.ok("로그아웃 되었습니다.");
//    }
//    @PostMapping("/logout") 
//    public ResponseEntity<?> logout(HttpServletRequest request) {
//        String token = request.getHeader("Authorization");
//        if (token != null && jwtProvider.validateToken(token)) {
//            String username = jwtProvider.getUsername(token);
//            redisUtil.deleteRefreshToken(username); // Redis에서 해당 유저의 refresh token 삭제
//            return ResponseEntity.ok("로그아웃 되었습니다.");
//        }
//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 토큰입니다.");
//    }
    
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        authService.logout(request);
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(0) // 즉시 만료
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
        return ResponseEntity.ok("성공적으로 로그아웃 처리되었습니다.");
    }
    
    @GetMapping("/check")
    public ResponseEntity<?> checkAuthStatus(@CookieValue(value = "jwt", required = false) String token) {
    	System.out.println("token="+token);
        // 2. 브라우저가 보낸 쿠키를 받아서 토큰 검증
        if (token == null || jwtProvider.isExpired(token)) {
            // 토큰이 없거나 만료되었으면 401 Unauthorized 응답
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 3. 토큰이 유효하면, 사용자 정보를 담아 200 OK 응답
        String username = jwtProvider.getUsername(token);
        Member member = memberService.findByUsername(username);
        String authorities = (String)jwtProvider.getAuthoritie(token);
        // 비밀번호 등 민감 정보는 제외하고 DTO로 만들어 반환하는 것이 좋음
        Map<String, Object> userInfo = Map.of(
        	"id", member.getId(),
            "username", member.getUsername(),
            "nickname", member.getNickname(),
            "memberId", member.getId(),
            "zonecode",member.getZonecode(),
            "roadAddress",member.getRoadAddress(),
            "namujiAddress",member.getNamujiAddress(),
            "auth", authorities
            // 필요한 다른 정보 추가
        );

        return ResponseEntity.ok(userInfo);
    }
    @PostMapping("/update")
    public ResponseEntity<?> uploadFile(@RequestPart(value="profileImage", required = false) MultipartFile file,
    		@RequestPart("username") String username,
    		@RequestPart("useremail") String useremail,
            @RequestPart("nickname") String nickname,
            @RequestPart("password") String password,
            @RequestPart("zonecode") String zonecode,
            @RequestPart("roadAddress") String roadAddress,
            @RequestPart("namujiAddress") String namujiAddress){
    	System.out.println("file="+file.getOriginalFilename());
    	System.out.println("username="+username);
    	
    	Member oldMember = memberService.findByUsername(username);
    	String msg = fileUpload.fileUpload(file);
    	Member newMember = Member.builder()
    						  .id(oldMember.getId())
    						  .username(username)
    						  .nickname(nickname)
    						  .password(password)
    						  .zonecode(zonecode)
    						  .roadAddress(roadAddress)
    						  .namujiAddress(namujiAddress)
    						  .build();
    	memberService.updateMember(newMember);
    	
    	return ResponseEntity.ok(Map.of("이미지 업로드 성공",msg));
    }
    
//    @GetMapping("/login/oauth2/code/kakao")
//    public ResponseEntity<?> kakaoLogin(HttpServletRequest request){
//    	
//    	System.out.println("카카오테스트");
//    	//String code = request.getParameter("code");
//    	//String kakaoAccessToken = authService.getKakaoAccessToken(code);
//    	return ResponseEntity.ok("");//authService.kakaoLogin(kakaoAccessToken);
//    }
}