package com.ssdam.tripPaw.domain;

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
public class MemberCheck {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String customContent;
	private boolean isChecked;
	private LocalDateTime createdAt = LocalDateTime.now();
	
	//CheckRoutine
	@ManyToOne
    @JoinColumn(name = "checkroutine_id")
	private Long checkRoutineId;
	
	//CheckTemplateItem
	@ManyToOne
    @JoinColumn(name = "checktemplateitem_id")
	private Long checkTemplateItemId;
	
}
