package com.ssdam.tripPaw.search;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.TripPlan;

@Mapper
public interface SearchMapper {
	
	List<Place> searchPlacesByKeyword(Map<String, Object> paramMap);


	List<TripPlan> searchTripPlansByKeyword(String keyword);


}
