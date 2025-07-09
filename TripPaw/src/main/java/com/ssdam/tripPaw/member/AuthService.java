package com.ssdam.tripPaw.member;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.member.config.MemberLoginForm;
import com.ssdam.tripPaw.member.config.MemberRole;
import com.ssdam.tripPaw.member.util.JwtFilter;
import com.ssdam.tripPaw.member.util.JwtProvider;
import com.ssdam.tripPaw.member.util.RedisUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
	
	private final MemberMapper memberMapper;
    //private final UserRepository userRepository;
    //private final RoleRepository roleRepository;
    
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final RedisUtil redisUtil;
    private final JwtFilter jwtFilter;
    private final RedisTemplate<String, String> redisTemplate;
    
    
//    public Map<String, String> login(LoginRequest request) {
//    	System.out.println("입력한 username: " + request.getUsername());
//        User user = userRepository.findByUsername(request.getUsername())
//                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//
//        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
//            throw new BadCredentialsException("Invalid password");
//        }
//
//        String accessToken = jwtProvider.generateAccessToken(user.getUsername());
//        String refreshToken = jwtProvider.generateRefreshToken(user.getUsername());
//
//        redisUtil.saveRefreshToken(user.getUsername(), refreshToken, 1209600000L);
//        System.out.println("accessToken"+accessToken);
//        System.out.println("refreshToken"+refreshToken);
//        Map<String, String> tokens = new HashMap<>();
//        tokens.put("accessToken", accessToken);
//        tokens.put("refreshToken", refreshToken);
//        return tokens;
//    }
    public Map<String, String> login(MemberLoginForm request) {
        System.out.println("입력한 username: " + request.getUsername());
        System.out.println("입력한 password: " + request.getPassword());
        // 1. 사용자 조회 (기존과 동일)
//        User user = userRepository.findByUsername(request.getUsername())
//                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + request.getUsername()));
        //토큰에 권한을 부여하기 위해 사용자 정보 가지고 옴
        Member member = memberMapper.findByUsername(request.getUsername());
        // 2. 비밀번호 검증 (기존과 동일)
        if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        // --- ★★★ 여기가 핵심 변경 부분입니다 ★★★ ---

        // 3. 인증 성공 후, JWT 생성을 위한 Authentication 객체 생성
        // 3-1. 사용자의 권한(Role) 정보를 GrantedAuthority 컬렉션으로 변환합니다.
        // ※ 중요: user.getRoles()는 사용자의 Role 리스트(예: List<String> 타입의 ["ROLE_USER", "ROLE_ADMIN"])를 반환해야 합니다.
        //         만약 메소드 이름이나 반환 타입이 다르면 이 부분은 실제 User 엔티티에 맞게 수정해야 합니다.
       // member.getRole().add(memberMapper.findMemberRoleTypeByMemberId(member.getId()));
        Collection<? extends GrantedAuthority> authorities = member.getRole().stream()
                .map(role -> new SimpleGrantedAuthority(role.name()))
                .collect(Collectors.toList());

        // 3-2. 사용자 이름과 권한 정보를 담아 Authentication 객체를 생성합니다.
        Authentication authentication = new UsernamePasswordAuthenticationToken(member.getUsername(), null, authorities);
        
        // 4. 변경된 JwtProvider에 맞게 Authentication 객체를 전달하여 토큰 생성
        String accessToken = jwtProvider.generateAccessToken(authentication);
        String refreshToken = jwtProvider.generateRefreshToken(authentication);
        
        // --- ★★★ 변경 부분 끝 ★★★ ---

        // 5. Refresh Token을 Redis에 저장 (기존과 동일)
        redisUtil.saveRefreshToken(member.getUsername(), refreshToken, 1209600000L);
        
        System.out.println("loginaccessToken" + accessToken);
        System.out.println("loginrefreshToken" + refreshToken);
        
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        return tokens;
    }
    public void logout(HttpServletRequest request) {
//    	 Collection<? extends GrantedAuthority> authorities = user.getRoles().stream()
//                 .map(role -> new SimpleGrantedAuthority(role.getName()))
//                 .collect(Collectors.toList());
//
//         // 3-2. 사용자 이름과 권한 정보를 담아 Authentication 객체를 생성합니다.
//         Authentication authentication = new UsernamePasswordAuthenticationToken(user.getUsername(), null, authorities);
//         
//         // 4. 변경된 JwtProvider에 맞게 Authentication 객체를 전달하여 토큰 생성
//         String accessToken1 = jwtProvider.generateAccessToken(authentication);
         
        // 1. 요청 헤더에서 Access Token을 추출합니다.
        String accessToken = resolveToken(request);
        System.out.println("logoutToken="+accessToken);
        if (!StringUtils.hasText(accessToken)) {
            // 토큰이 없는 경우 처리
            return;
        }

        // 2. 토큰이 유효한지 검증합니다.
        if (!jwtProvider.validateToken(accessToken)) {
            // 유효하지 않은 토큰에 대한 처리 (예: 예외 발생)
            throw new IllegalArgumentException("유효하지 않은 토큰입니다.");
        }

        // 3. Access Token에서 사용자 정보(Authentication)를 가져옵니다.
        Authentication authentication = jwtProvider.getAuthentication(accessToken);

        // 4. Redis에서 해당 사용자의 Refresh Token이 있다면 삭제합니다.
        //    (로그인 시 "RT:" + username 을 Key로 Refresh Token을 저장했다고 가정)
        if (redisTemplate.opsForValue().get("RT:" + authentication.getName()) != null) {
            redisTemplate.delete("RT:" + authentication.getName());
        }

        // 5. 현재 Access Token을 블랙리스트에 등록합니다.
        //    남은 유효 시간만큼만 Redis에 저장하여 메모리를 관리합니다.
        Long expiration = jwtProvider.getExpiration(accessToken);
        redisTemplate.opsForValue().set(accessToken, "logout", expiration, TimeUnit.MILLISECONDS);
    }
    public void register(Member request) {
        // 이미 존재하는 사용자 확인 (선택)
    	if(memberMapper.findByUsername(request.getUsername())!=null) {
		   throw new IllegalArgumentException("이미 존재하는 사용자입니다.");
    	}
//        if (userRepository.existsByUsername(request.getUsername())) {
//            throw new IllegalArgumentException("이미 존재하는 사용자입니다.");
//        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());
     // 1. 데이터베이스에서 "ROLE_USER" 역할을 조회합니다.
//        Role userRole = roleRepository.findByName("ROLE_USER")
//                .orElseThrow(() -> new RuntimeException("오류: ROLE_USER가 데이터베이스에 없습니다."));
                // 이전에 알려드린 AppConfig의 데이터 초기화 로직이 실행되었다면 이 역할은 반드시 존재합니다.

        // 유저 엔티티 생성
//        User user = new User();
//        user.setUsername(request.getUsername());
//        user.setPassword(encodedPassword);
        Member member = Member.builder()
        					  .username(request.getUsername())
        					  .password(encodedPassword)
        					  .email(request.getEmail())
        					  .provider(request.getProvider())
        					  .nickname(request.getNickname())
        					  .zonecode(request.getZonecode())
        					  .roadAddress(request.getRoadAddress())
        					  //.jibunAddress(request.getJibunAddress())
        					  .namujiAddress(request.getNamujiAddress())
        					  //.role(MemberRole.MEMBER)
        					  .build();
        //member.getRole().add(MemberRole.MEMBER);
        memberMapper.insert(member);				
        Member newMember = memberMapper.findByUsername(request.getUsername());
        memberMapper.insertMemberRole(newMember.getId(), MemberRole.MEMBER);
       // member.setUsername(request.getUsername());
       // member.setPassword(encodedPassword);
        // 3. 생성된 유저 엔티티에 조회한 역할을 추가합니다.
       // user.getRoles().add(userRole);
        // 저장
        //userRepository.save(user);
    }
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        System.out.println("bearerToken="+bearerToken);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
//    @Transactional
//    public KakaoTokenDto getKakaoAccessToken(String code) {
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
//
//        // Http Response Body 객체 생성
//        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
//        params.add("grant_type", "authorization_code"); //카카오 공식문서 기준 authorization_code 로 고정
//        params.add("client_id", KAKAO_CLIENT_ID); // 카카오 Dev 앱 REST API 키
//        params.add("redirect_uri", KAKAO_REDIRECT_URI); // 카카오 Dev redirect uri
//        params.add("code", code); // 프론트에서 인가 코드 요청시 받은 인가 코드값
//        params.add("client_secret", KAKAO_CLIENT_SECRET); // 카카오 Dev 카카오 로그인 Client Secret
//
//        // 헤더와 바디 합치기 위해 Http Entity 객체 생성
//        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest = new HttpEntity<>(params, headers);
//
//        // 카카오로부터 Access token 받아오기
//        RestTemplate rt = new RestTemplate();
//        ResponseEntity<String> accessTokenResponse = rt.exchange(
//                KAKAO_TOKEN_URI, // "https://kauth.kakao.com/oauth/token"
//                HttpMethod.POST,
//                kakaoTokenRequest,
//                String.class
//        );
//
//        // JSON Parsing (-> KakaoTokenDto)
//        ObjectMapper objectMapper = new ObjectMapper();
//        objectMapper.registerModule(new JavaTimeModule());
//        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
//        KakaoTokenDto kakaoTokenDto = null;
//        try {
//            kakaoTokenDto = objectMapper.readValue(accessTokenResponse.getBody(), KakaoTokenDto.class);
//        } catch (JsonProcessingException e) {
//            e.printStackTrace();
//        }
//
//        return kakaoTokenDto;
//    }
    
}