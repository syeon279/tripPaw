package com.ssdam.tripPaw.member.config;

public enum MemberRole {
	ADMIN("ROLE_ADMIN"), // 이것 자체가 생성자가 됨
	SYSTEM("ROLE_SYSTEM"),
	MEMBER("ROLE_MEMBER");
	private String value;

	private MemberRole(String value) {
		this.value = value;
	}//ROLE_ADMIN = 0, ROLE_SYSTEM 1~1000, ROLE_MEMBER = 1001~
	
}
