package com.ssdam.tripPaw.search;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.TripPlan;

@Mapper
public interface SearchMapper {
	
	List<Place> searchPlacesByKeyword(String keyword);

	List<TripPlan> searchTripPlansByKeyword(String keyword);


}
