package com.ssdam.tripPaw.review;

import org.apache.ibatis.annotations.Mapper;

import com.ssdam.tripPaw.domain.TripPlan;

@Mapper
public interface TripPlanMapper {
	TripPlan findByIdWithCourses(Long id); // JOIN해서 course, route, route_place, place까지 가져오기
}
