package com.ssdam.tripPaw.domain;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import lombok.Getter;
import lombok.Setter;

@Entity @Getter @Setter
public class Seal {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false)
	private String name;
	private String imageUrl;
	
	//장소연결필요
	
	//여권-도장 연결
	@OneToMany(mappedBy = "seal", cascade = CascadeType.ALL,  orphanRemoval = true)
	private List<PassportSeal> PassportSeals = new ArrayList<>();
}
