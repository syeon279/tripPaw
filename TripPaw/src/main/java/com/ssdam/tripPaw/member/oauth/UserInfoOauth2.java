package com.ssdam.tripPaw.member.oauth;

public interface UserInfoOauth2 {
	String getProviderId();
	String getProvider();
	String getEmail();
	String getNickname();
	String getImage();
	
}
//com.company.project001.oauth
//UserInfoOauth2
//provider = "google", "kakao", "naver", "facebook"
//providerId = google은 sub, kakao/facebook은 id, naver는 response 를 던져 줌
//username = providerId설정
//nickname = 각 사이트에서 등록한 이름으로 설정

/*
 * 
 * 
 * */
