package com.ssdam.tripPaw.member;

import org.apache.ibatis.annotations.Mapper;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.member.config.MemberRole;

@Mapper
public interface MemberMapper {
	public int insert(Member member);
	public int insertMemberRole(Long memberId, MemberRole memberRoleType);
}
