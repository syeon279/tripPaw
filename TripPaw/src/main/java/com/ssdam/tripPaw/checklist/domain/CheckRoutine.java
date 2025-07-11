package com.ssdam.tripPaw.checklist.domain;
//유저 루틴

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.ssdam.tripPaw.member.domain.Member;

import lombok.Getter;
import lombok.Setter;

@Entity @Getter @Setter
public class CheckRoutine {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String title;
	private boolean isSaved;
	private LocalDateTime createdAt = LocalDateTime.now();
	
	//유저아이디 연결
	@ManyToOne @JoinColumn(name="member_id")
	private Member member;
	
	//여행경로 아이디 연결
}
