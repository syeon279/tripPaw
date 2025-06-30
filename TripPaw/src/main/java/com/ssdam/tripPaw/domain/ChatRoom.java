package com.ssdam.tripPaw.domain;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.ssdam.tripPaw.member.config.MemberRole;

import lombok.Data;

@Entity
@Table(name = "ChatRoom") // DB 테이블명과 맞추기
@Data
public class ChatRoom {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false, length = 255)
	private String title;
	@Column(nullable = false, length = 255)
	private String description;
	private boolean isGroup;
	private LocalDateTime createdAt = LocalDateTime.now();
	private LocalDateTime updatedAt;
	
	@ManyToMany(mappedBy="chatRoomMember")
	private Set<Member> members = new HashSet<>();
	
}
