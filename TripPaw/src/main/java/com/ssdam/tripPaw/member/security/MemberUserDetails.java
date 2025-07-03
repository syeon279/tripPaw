package com.ssdam.tripPaw.member.security;

import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.ssdam.tripPaw.domain.Member;
//UserDetails 유저정보를 던저주는 class // OAuth2User api에서 내가 원하는 값을 가져올 수 있음
public class MemberUserDetails implements UserDetails, OAuth2User{
	private static final long serialVersionUID = 1L;
	private Member member;
	private Map<String, Object> attributes;
	public MemberUserDetails(Member member) {
		super();
		this.member = member;
	}

/////////////////UserDetails/////////////////////////////
//권한작업 role
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
//		Collection<GrantedAuthority> collections = new ArrayList<>();
//		collections.add(() -> {return member.getRole().name();});
//		return collections;
		return member.getRole().stream()
	            // 2. 각각의 역할(MemberRole Enum)을 SimpleGrantedAuthority 객체로 변환합니다.
	            //    role.name()은 "ROLE_MEMBER" 같은 문자열을 반환합니다.
	            .map(role -> new SimpleGrantedAuthority(role.name()))
	            // 3. 변환된 SimpleGrantedAuthority 객체들을 모두 모아서 List로 만듭니다.
	            .collect(Collectors.toList());
	}

	@Override
	public String getPassword() {
		// TODO Auto-generated method stub
		return member.getPassword();
	}

	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return member.getUsername();
	}
	//계정만료 됐는지 체크 = true 만료x
	//은행에서 시간되면 
	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}
	//계정잠김 - true 안잠김
	@Override
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return true;
	}
	//비밀번호 만료 - true 만료x 
	@Override
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}
	//계정활성화(사용가능) - true 활성화
	@Override
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return true;
	}
/////////////////OAuth2User/////////////////////////////
	
	public MemberUserDetails(Member member, Map<String, Object> attributes) {
		super();
		this.member = member;
		this.attributes = attributes;
	}
	
	@Override
	public Map<String, Object> getAttributes() {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public <A> A getAttribute(String name) {
		return OAuth2User.super.getAttribute(name);
	}
	@Override
	public String getName() {
		return null;
	}
	public String getNickname() {return member.getNickname();}
	public String getEmail() {return member.getEmail();}
/////////////////OAuth2User/////////////////////////////
}
