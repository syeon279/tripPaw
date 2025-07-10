package com.ssdam.tripPaw.search;

import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.TripPlan;
import com.ssdam.tripPaw.dto.PlaceSearchDto;
import com.ssdam.tripPaw.dto.SearchResultDto;
import com.ssdam.tripPaw.dto.TripPlanSearchDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SearchService {

    private final SearchMapper searchMapper;

    public SearchResultDto search(String keyword) {
    	System.out.println("🔍 keyword: " + keyword);

        List<Place> places = searchMapper.searchPlacesByKeyword(keyword);
        List<TripPlan> tripPlans = searchMapper.searchTripPlansByKeyword(keyword);

        List<PlaceSearchDto> placeDtos = mapPlaceList(places);
        List<TripPlanSearchDto> tripPlanDtos = mapTripPlanList(tripPlans);

        return new SearchResultDto(placeDtos, tripPlanDtos);
    }
    
    //장소 검색    
    private List<PlaceSearchDto> mapPlaceList(List<Place> places) {
        return places.stream().map(p -> {
            PlaceSearchDto dto = new PlaceSearchDto();
            dto.setId(p.getId());
            dto.setName(p.getName());
            dto.setDescription(p.getDescription());
            dto.setLatitude(p.getLatitude());
            dto.setLongitude(p.getLongitude());
            dto.setRegion(p.getRegion());
            dto.setOpenHours(p.getOpenHours());
            dto.setPetFriendly(p.isPetFriendly());
            dto.setPetVerified(p.isPetVerified());
            dto.setRestDays(p.getRestDays());
            dto.setPrice(p.getPrice());
            dto.setParking(p.getParking());
            dto.setPhone(p.getPhone());
            dto.setImageUrl(p.getImageUrl());
            dto.setHomePage(p.getHomePage());
            dto.setExternalContentId(p.getExternalContentId());
            dto.setSource(p.getSource());

            dto.setPlaceType(p.getPlaceType());
            dto.setReviews(p.getReviews());
            dto.setPlaceImages(p.getPlaceImages());

            // ✅ reviewCount 계산
            int reviewCount = (p.getReviews() != null) ? p.getReviews().size() : 0;
            dto.setReviewCount(reviewCount);

            // ✅ avgRating 계산
            double avgRating = 0.0;
            if (p.getReviews() != null && !p.getReviews().isEmpty()) {
            	avgRating = p.getReviews().stream()
            		    .mapToInt(r -> {
            		        Integer rating = r.getRating();
            		        return (rating != null) ? rating : 0;
            		    })
            		    .average()
            		    .orElse(0.0);
            }
            dto.setAvgRating(avgRating);

            return dto;
        }).collect(Collectors.toList());
    }


    private List<TripPlanSearchDto> mapTripPlanList(List<TripPlan> tripPlans) {
        return tripPlans.stream().map(tp -> {
            TripPlanSearchDto dto = new TripPlanSearchDto();
            dto.setId(tp.getId());
            dto.setTitle(tp.getTitle());
            dto.setDays(tp.getDays());
            dto.setPublicVisible(tp.isPublicVisible());
            dto.setCreatedAt(tp.getCreatedAt());
            dto.setImageUrl(tp.getImageUrl());

            dto.setTripPlanCourses(tp.getTripPlanCourses());
            dto.setReviews(tp.getReviews());

            dto.setAvgRating(tp.getAvgRating());        // MyBatis가 함께 조회한 값
            dto.setReviewCount(tp.getReviewCount());    // MyBatis가 함께 조회한 값

            return dto;
        }).collect(Collectors.toList());
    }


}