package com.ssdam.tripPaw.domain;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.ssdam.tripPaw.member.config.MemberRole;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "member") // DB 테이블명과 맞추기
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
	@Column(nullable = true, length = 255)
	private String zonecode;
	@Column(name = "road_address", nullable = true, length = 255)
	private String roadAddress;
//	@Column(nullable = false, length = 255)
//	private String jibunAddress;
	@Column(name = "namuji_address", nullable = true, length = 255)
	private String namujiAddress;
	 // JPA에서 Set<Enum>을 매핑하는 올바른 방법
    @ElementCollection(targetClass = MemberRole.class) // 컬렉션 요소의 타입 지정
    @CollectionTable(name = "member_roles", // 역할을 저장할 조인 테이블 이름 (DB에 실제 생성될 테이블)
                     joinColumns = @JoinColumn(name = "member_id")) // member_roles 테이블에서 Member 엔티티의 ID를 참조하는 컬럼 이름
    @Column(name = "role_name", nullable = false) // member_roles 테이블에서 역할 이름(String)을 저장할 컬럼 이름
    @Enumerated(EnumType.STRING) // Enum을 문자열로 저장하도록 지정 (ORDINAL도 가능)
    @Builder.Default // @Builder 사용 시 필드 초기값 설정
    private Set<MemberRole> role = new HashSet<>(); // 초기화는 필수
//	@Enumerated
//	private Set<MemberRole> role; //ROLE_ADMIN = 0, ROLE_SYSTEM 1~1000, ROLE_MEMBER = 1001~
	@Column(nullable = false, length = 20)
	private String provider; // thejoa, kakao, naver, google 회원가입한 경로 저장
	 @Column(name = "created_at")
	private LocalDateTime createdAt = LocalDateTime.now();
	
	//private List<Board> board; //연관된 게시물 목록 (Mybatis에서 직접매핑)
	
//	@Builder
//	public Member(String username, String email, String nickname, String image, MemberRole role, String provider, String password) {
//		super();
//		this.username = username;
//		this.email = email;
//		this.nickname = nickname;
//		this.role = role;
//		this.provider = provider;
//		this.password = password;
//	}
	
	//////chat///////////////////////////////////////
	@OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Chat> chats = new ArrayList<>();
	 @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
	    private List<ChatRoomMember> chatRoomMembers = new ArrayList<>();
	//////chat///////////////////////////////////////
	@ManyToMany
	@JoinTable(
	    name = "member_likes_review",
	    joinColumns = @JoinColumn(name = "member_id"),
	    inverseJoinColumns = @JoinColumn(name = "review_id")
	)
	private Set<Review> likedReviews = new HashSet<>();
	
	@ManyToMany
	@JoinTable(
	    name = "member_badge",
	    joinColumns = @JoinColumn(name = "member_id"),
	    inverseJoinColumns = @JoinColumn(name = "badge_id")
	)
	private Set<Badge> badges = new HashSet<>();
	
	@OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Review> reviews = new ArrayList<>();
	
}