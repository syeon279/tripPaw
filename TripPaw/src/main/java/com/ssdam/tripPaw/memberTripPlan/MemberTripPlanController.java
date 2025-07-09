package com.ssdam.tripPaw.memberTripPlan;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssdam.tripPaw.domain.MemberTripPlan;
import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.TripPlanCourse;
import com.ssdam.tripPaw.dto.MyTripsDto;
import com.ssdam.tripPaw.dto.TripSaveRequest;
import com.ssdam.tripPaw.tripPlan.TripPlanService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/memberTripPlan")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MemberTripPlanController {

    private final MemberTripPlanMapper memberTripPlanMapper;
    private final TripPlanService tripPlanService;
    private final MemberTripPlanService memberTripPlanService;

    // 경로 상세보기
    @GetMapping("/{id}")
    public ResponseEntity<?> getMemberTripById(@PathVariable Long id) {
        MemberTripPlan plan = memberTripPlanMapper.findById(id);
        if (plan == null) return ResponseEntity.notFound().build();

        TripSaveRequest dto = new TripSaveRequest();
        dto.setTitle(plan.getTripPlan().getTitle());
        dto.setStartDate(plan.getStartDate().toString());
        dto.setEndDate(plan.getEndDate().toString());
        dto.setCountPeople(plan.getCountPeople());
        dto.setCountPet(plan.getCountPet());

        List<TripSaveRequest.RouteDay> routeData = new ArrayList<>();

        // ✅ TripPlanCourse 하나 = 하루
        List<TripPlanCourse> courses = plan.getTripPlan().getTripPlanCourses();
        for (int i = 0; i < courses.size(); i++) {
            TripPlanCourse course = courses.get(i);
            TripSaveRequest.RouteDay day = new TripSaveRequest.RouteDay();
            day.setDay(i + 1); // 1일부터 시작

            List<TripSaveRequest.PlaceDto> places = course.getRoute().getRoutePlaces().stream()
                .map(rp -> {
                    Place p = rp.getPlace();
                    TripSaveRequest.PlaceDto pd = new TripSaveRequest.PlaceDto();
                    pd.setPlaceId(p.getId());
                    pd.setName(p.getName());
                    pd.setLatitude(p.getLatitude());
                    pd.setLongitude(p.getLongitude());
                    return pd;
                })
                .collect(Collectors.toList());

            day.setPlaces(places);
            routeData.add(day);
        }

        dto.setRouteData(routeData);

        return ResponseEntity.ok(dto);
    }
    
    // 특정 유저의 내 여행  목록 (/memberTripPlan/{id}/mytrips)
    @GetMapping("/{id}/mytrips")
    public ResponseEntity<List<MyTripsDto>> getMyTrips(@PathVariable Long id) {
    	List<MyTripsDto> dtos = memberTripPlanService.getMyTripsByMember(id);
    	System.out.println("MyTripsDto : " + dtos);
    	return ResponseEntity.ok(dtos);
    }
    
    
}

