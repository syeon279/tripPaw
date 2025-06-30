package com.ssdam.tripPaw.domain;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "chat") // DB 테이블명과 맞추기
@Data
public class Chat {
	private Long id;
	private String content;
	private String contentType;
	private LocalDateTime sentAt = LocalDateTime.now();
	
	@ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
}
