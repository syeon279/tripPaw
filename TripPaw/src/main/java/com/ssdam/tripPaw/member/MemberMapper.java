package com.ssdam.tripPaw.member;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.member.config.MemberRole;

@Mapper
public interface MemberMapper {
	public Member findMemberById(String memberId);
	public Member findByUsername(String username);
	public Member findById(Long id);
	public List<Member> findAllByIds(@Param("ids") List<Long> ids);
	public Member findAll();
	public int insert(Member member);
	public int update(Member member);
	public int delete(Long id);
	public int updateByIdAndPassword(@Param("id") Long id
									,@Param("oldPassword") String oldPassword
									,@Param("newPassword") String newPassword );

	public int insertMemberRole(Long memberId, MemberRole memberRoleType);
}
