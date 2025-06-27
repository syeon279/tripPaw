package com.ssdam.tripPaw.member.domain;
import java.time.LocalDateTime;

import com.ssdam.tripPaw.member.config.MemberRole;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Member {
	private Long id;
	private String username;
	private String password;
	private String nickname;
	private String email;
	private String roadAddress;
	private String jibunAddress;
	private String namujiAddress;
	private MemberRole role; //ROLE_ADMIN = 0, ROLE_SYSTEM 1~1000, ROLE_MEMBER = 1001~
	private String provider; // thejoa, kakao, naver, google 회원가입한 경로 저장
	private LocalDateTime createdAt = LocalDateTime.now();
	
	//private List<Board> board; //연관된 게시물 목록 (Mybatis에서 직접매핑)

	@Builder
	public Member(String username, String email, String nickname, String image, MemberRole role, String provider, String password) {
		super();
		this.username = username;
		this.email = email;
		this.nickname = nickname;
		this.role = role;
		this.provider = provider;
		this.password = password;
	}
	
}
