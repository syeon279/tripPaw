package com.ssdam.tripPaw.domain;
//관리자 체크리스트 템플릿(묶음) 관리 테이블

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import lombok.Getter;
import lombok.Setter;

@Entity @Getter @Setter
public class CheckTemplate {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String title;
	private int type;
	private LocalDateTime createdAt = LocalDateTime.now();
	
	//유저 식별용 유저 아이디 필요
	@ManyToOne @JoinColumn(name="member_id")
	private Member memberId;
	
	@OneToMany(mappedBy = "checkTemplate", cascade = CascadeType.ALL)
    private List<CheckTemplateItem> items = new ArrayList<>();
}
