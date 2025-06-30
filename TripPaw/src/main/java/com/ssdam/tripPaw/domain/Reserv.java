package com.ssdam.tripPaw.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.ssdam.tripPaw.reserv.ReservState;

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
	private LocalDate deleteAt;
	
    @Enumerated(EnumType.STRING)
    private ReservState state;
    
	private LocalDateTime createdAt = LocalDateTime.now();
    
	private int countPeople;
	private int countPet;
	
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id", nullable = false)
    private Place place;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tripPlan_id", nullable = false)
    private TripPlan tripPlan;
}
