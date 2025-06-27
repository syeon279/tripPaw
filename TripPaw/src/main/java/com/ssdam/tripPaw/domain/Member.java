package com.ssdam.tripPaw.domain;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.ssdam.tripPaw.member.config.MemberRole;

import lombok.Builder;
import lombok.Data;

@Entity
@Table(name = "member") // DB 테이블명과 맞추기
@Data
public class Member {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false, length = 20)
	private String username;
	@Column(nullable = false, length = 255)
	private String password;
	@Column(nullable = false, length = 20)
	private String nickname;
	@Column(nullable = false, length = 255)
	private String email;
	@Column(nullable = false, length = 255)
	private String road_address;
	@Column(nullable = false, length = 255)
	private String jibun_address;
	@Column(nullable = false, length = 255)
	private String namuji_address;
	@Column(nullable = false, length = 20)
	private MemberRole role; //ROLE_ADMIN = 0, ROLE_SYSTEM 1~1000, ROLE_MEMBER = 1001~
	@Column(nullable = false, length = 20)
	private String provider; // thejoa, kakao, naver, google 회원가입한 경로 저장
	 @Column(name = "created_at")
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
