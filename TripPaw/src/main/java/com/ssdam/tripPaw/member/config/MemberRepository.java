package com.ssdam.tripPaw.member.config;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssdam.tripPaw.domain.Member;

public interface MemberRepository extends JpaRepository<Member, Long>{

}
