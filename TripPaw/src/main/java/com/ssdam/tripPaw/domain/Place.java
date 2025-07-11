package com.ssdam.tripPaw.domain;


import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;

import lombok.Data;

@Entity
@Data
public class Place {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String name;
	private String desciption;
	private String latitude;
	private String longitude;
	private String regoin;
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
	
    @ManyToMany
    @JoinTable(
        name = "place_category",
        joinColumns = @JoinColumn(name = "place_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories = new ArrayList<>();
}

