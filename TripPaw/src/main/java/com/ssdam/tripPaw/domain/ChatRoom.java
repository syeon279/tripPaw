package com.ssdam.tripPaw.domain;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.ssdam.tripPaw.member.config.MemberRole;

import lombok.Data;

@Entity
@Table(name = "ChatRoom") // DB 테이블명과 맞추기
@Data
public class ChatRoom {
	private Long id;
	private String title;
	private String description;
	private boolean isGroup;
	private LocalDateTime createdAt = LocalDateTime.now();
	private LocalDateTime updatedAt;
	
	@ManyToMany(mappedBy="chatRoomMember")
	private Set<Member> members = new HashSet<>();
	
}
