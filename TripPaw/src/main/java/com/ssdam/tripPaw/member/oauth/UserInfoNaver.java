package com.ssdam.tripPaw.member.oauth;

import java.util.Map;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class UserInfoNaver implements UserInfoOauth2{
	
	private final Map<String, Object> attributes;
	private Map<String, Object> getResponse(){
		Object response = attributes.get("reponse");
//		if(response instanceof Map) {
			
		//}
		return response instanceof Map ? (Map<String, Object>) response : null; 
	}
	@Override
	public String getProviderId() {
		Map<String, Object> response = getResponse();
		return response != null ? String.valueOf(response.get("id")) : null;
	}

	@Override
	public String getProvider() {
		return "naver";
	}

	@Override
	public String getEmail() {
		Map<String, Object> response = getResponse();
		
		return response != null ? String.valueOf(response.get("email")) : null;
	}

	@Override
	public String getNickname() {
		Map<String, Object> response = getResponse();
		return response != null ? String.valueOf(response.get("nickname")) : null;
	}

	@Override
	public String getImage() {
		Map<String,Object> props = getResponse();
		String image = props != null ? (String) props.get("profile_image") : null;
		return image != null ? image : "/images/thejoa.png";
	}
	
}
/*
 * <naver>
{
    resultcode=00, 
    message=success, 
    response = {
        id=pvdq1FSG3VZlD7Cp3JuWfAFi-3xir6A-WPlP5f8kXIo,
		email=sally03915@naver.com, 
        name=안효정
    }
}
 * */
