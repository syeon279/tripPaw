package com.ssdam.tripPaw.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@NoArgsConstructor
public class Reserv {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private LocalDate startDate;
	private LocalDate endDate;
	private LocalDate expireAt;
	
	private String state;
	private LocalDateTime createdAt;
	private String reservType;
	private int countPeople;
	private int countPet;
	
}
