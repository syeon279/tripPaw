// TripPlanService.java
package com.ssdam.tripPaw.tripPlan;

import com.ssdam.tripPaw.dto.TripRecommendRequest;
import com.ssdam.tripPaw.dto.TripRecommendResponse;
import com.ssdam.tripPaw.dto.TripSaveRequest;
import com.ssdam.tripPaw.place.PlaceMapper;
import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.Route;
import com.ssdam.tripPaw.domain.RoutePlace;
import com.ssdam.tripPaw.domain.TripPlan;
import com.ssdam.tripPaw.domain.TripPlanCourse;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripPlanService_my {

    private final PlaceMapper placeMapper;
    private final TripPlanMapper tripPlanMapper;

    public List<TripRecommendResponse> recommend(TripRecommendRequest request) {
        LocalDate startDate = LocalDate.parse(request.getStartDate());
        LocalDate endDate = LocalDate.parse(request.getEndDate());
        int totalDays = calculateTripDays(startDate, endDate);

        List<TripRecommendResponse> tripPlans = new ArrayList<>();

        for (int i = 0; i < totalDays; i++) {
            // ✅ 매일 장소를 새로 추천 (4개 랜덤 추출)
            List<Place> dailyPlaces = placeMapper.findRecommendedPlacesByRandom(
                request.getRegion(),
                request.getSelectedCategoryIds()
            );

            List<TripRecommendResponse.PlaceInfo> placeInfos = dailyPlaces.stream()
                .map(p -> new TripRecommendResponse.PlaceInfo(
                    p.getId(), p.getName(), p.getDescription(), p.getLatitude(), p.getLongitude(), p.getImageUrl()))
                .collect(Collectors.toList());

            tripPlans.add(new TripRecommendResponse(
                i + 1,
                placeInfos,
                startDate,
                endDate
            ));
        }

        return tripPlans;
    }

    private int calculateTripDays(LocalDate startDate, LocalDate endDate) {
        return (int) ChronoUnit.DAYS.between(startDate, endDate) + 1;
    }
    
    
    //// 여행 insert
    public void saveTrip(TripSaveRequest request) {
        // 1. TripPlan 저장
        TripPlan tripPlan = new TripPlan();
        tripPlan.setTitle(request.getTitle());
        tripPlan.setDays(request.getRouteData().size());
        tripPlan.setPublicVisible(true); // 공개 여부는 기본 true 처리
        tripPlan.setImageUrl(request.getImageUrl());
        Member member = new Member();
        member.setId(1l);
        tripPlan.setMember(member); // 👈 임시로 memberId = 1 (로그인 기능 붙으면 수정)
        tripPlanMapper.insertTripPlan(tripPlan);

     // 2. 각 day별 루트 저장
        for (TripSaveRequest.RouteDay routeDay : request.getRouteData()) {
            Route route = new Route();

            // 👇 제목 + 일차 형식의 이름 지정
            String routeName = request.getTitle() + "_" + routeDay.getDay() + "일차";
            route.setName(routeName);

            tripPlanMapper.insertRoute(route);
            
            // 3. 루트에 장소들 저장 (순서대로)
            AtomicInteger sequence = new AtomicInteger(1);
            for (TripSaveRequest.PlaceDto placeDto : routeDay.getPlaces()) {
                Place place = new Place();
                place.setId(placeDto.getPlaceId());

                RoutePlace routePlace = new RoutePlace();
                routePlace.setRoute(route);
                routePlace.setPlace(place);
                routePlace.setSequence(sequence.getAndIncrement());

                tripPlanMapper.insertRoutePlace(routePlace);
            }

            // 4. TripPlanCourse에 연결
            TripPlanCourse course = new TripPlanCourse();
            course.setTripPlan(tripPlan);
            course.setRoute(route);
            tripPlanMapper.insertTripPlanCourse(course);
        }
    }
    
    // 여행 꺼내오기
    public List<TripPlan> getAllTrips() {
        return tripPlanMapper.findAllTrips();
    }
    
}
