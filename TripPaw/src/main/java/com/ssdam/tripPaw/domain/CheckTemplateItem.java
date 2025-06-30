package com.ssdam.tripPaw.domain;
//체크리스트 항목(단일) 저장용

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Getter;
import lombok.Setter;

@Entity @Getter @Setter
public class CheckTemplateItem {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String content;
	private LocalDateTime createdAt = LocalDateTime.now();

	//CheckTemplate 연결
	@ManyToOne @JoinColumn(name = "checktemplate_id")
	private CheckTemplate checkTemplate;
	
	
}
