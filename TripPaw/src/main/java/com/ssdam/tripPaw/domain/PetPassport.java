package com.ssdam.tripPaw.domain;
//반려동물 여권

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
public class PetPassport {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String petName;
	private String species;
	private Integer petAge;
	private String petGender;
	private String imageUrl;
	
	private LocalDateTime createdAt = LocalDateTime.now();
	
	@ManyToOne @JoinColumn(name = "member_id")
	private Member member;
	
}
