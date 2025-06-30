package com.ssdam.tripPaw.member;

import org.apache.ibatis.annotations.Mapper;

import com.ssdam.tripPaw.domain.Member;

@Mapper
public interface MemberMapper {
	public int insert(Member member);
}
