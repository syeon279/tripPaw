package com.ssdam.tripPaw.member.oauth;
import java.util.Map;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class UserInfoGoogle implements UserInfoOauth2{
	
	private final Map<String, Object> attributes;
	
	@Override
	public String getProviderId() {
		Object value = attributes.get("sub");
		
		return value != null ? value.toString() : null;
	}

	@Override
	public String getProvider() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getEmail() {
		return (String)attributes.get("email");
	}

	@Override
	public String getNickname() {
		// TODO Auto-generated method stub
		return (String)attributes.get("name");
	}

	@Override
	public String getImage() {
		Object pic =  (String)attributes.get("picture");
		return pic != null ? pic.toString() : "/images/thejoa.png";
	}
	
}
/*<google>
 * {
   sub=103058387739722400130, 
   name=안효정, 
   given_name=효정, 
   family_name=안, 
   picture=https://lh3.googleusercontent.com/a/AEdFTp5SiCyTaOLog9sDPN6QhWwsUj7xPbfj4HQF0fdC=s96-c, email=chb20050@gmail.com, 
   email_verified=true, 
   locale=ko
}
 * */