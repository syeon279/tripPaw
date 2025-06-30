package com.ssdam.tripPaw.domain;


import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;

import lombok.Data;

@Entity
@Data
public class Place {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String name;
	private String description;
	private String latitude;
	private String longitude;
	private String region;
	private String openHours;
	private boolean petFriendly;
	private boolean petVerified;
	private String restDays;
	private String price;
	private String phone;
	private String imageUrl;
	private String homePage;
	private Long extermalContentId;
	private String source;
	
	private PlaceType placeType;
	
	@OneToMany
	private List<PlaceImage> placeImage = new ArrayList<>();
	
    @ManyToMany
    @JoinTable(
        name = "place_category",
        joinColumns = @JoinColumn(name = "place_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories = new ArrayList<>();
    
    @OneToMany(mappedBy = "place", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RoutePlace> routePlaces;
}

