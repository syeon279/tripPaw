package com.ssdam.tripPaw.tripPlan;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.ssdam.tripPaw.domain.Route;
import com.ssdam.tripPaw.domain.RoutePlace;
import com.ssdam.tripPaw.domain.TripPlan;
import com.ssdam.tripPaw.domain.TripPlanCourse;

@Mapper
public interface TripPlanMapper {
	TripPlan findByIdWithCourses(Long id); // JOIN해서 course, route, route_place, place까지 가져오기

	int insertTripPlan(TripPlan tripPlan);

	int insertRoute(Route route);

	int insertRoutePlace(RoutePlace routePlace);

	int insertTripPlanCourse(TripPlanCourse course);

	List<TripPlan> findAllTrips(); 
}
