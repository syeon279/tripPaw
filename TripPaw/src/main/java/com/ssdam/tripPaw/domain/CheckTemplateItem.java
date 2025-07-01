package com.ssdam.tripPaw.domain;
//체크리스트 항목(단일) 저장용

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity @Getter @Setter
@NoArgsConstructor
public class CheckTemplateItem {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String content;
	private LocalDateTime createdAt = LocalDateTime.now();

	//CheckTemplate 연결
	@ManyToOne @JoinColumn(name = "checktemplate_id")
	private CheckTemplate checkTemplate;
	
	@javax.persistence.Transient  // JPA 저장 시 무시
	private Long checktemplateId;
	public Long getChecktemplateId() {   return checktemplateId;	}

	private CheckTemplateItem(Long id, String content, LocalDateTime createdAt, CheckTemplate checkTemplate) {
		super();
		this.id = id;
		this.content = content;
		this.createdAt = createdAt;
		this.checkTemplate = checkTemplate;
		
		this.checkTemplate = new CheckTemplate();
	    this.checkTemplate.setId(checktemplateId);
	}
		
	// 더미데이터용
	public CheckTemplateItem(Long id, Long checktemplateId, String content, String code) {
	    this.id = id;
	    this.content = content;
	    this.createdAt = LocalDateTime.now();
	    this.checktemplateId = checktemplateId;
	    
	    this.checkTemplate = new CheckTemplate();
	    this.checkTemplate.setId(checktemplateId);
	}
}
