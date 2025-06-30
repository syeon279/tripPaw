package com.ssdam.tripPaw.domain;

import javax.persistence.Entity;

@Entity
public class PlaceImage {
	
	private Long id;
	private String imageUrl;
	private Place place;
}
