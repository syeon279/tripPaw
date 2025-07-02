// TripRecommendService.java
package com.ssdam.tripPaw.place;

import com.ssdam.tripPaw.dto.TripRecommendRequest;
import com.ssdam.tripPaw.dto.TripRecommendResponse;
import com.ssdam.tripPaw.domain.Place;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripRecommendService {

    private final PlaceMapper placeMapper;

    public List<TripRecommendResponse> recommend(TripRecommendRequest request) {
        List<Place> places = placeMapper.findByRegionAndCategories(
            request.getRegion(), request.getSelectedCategoryIds());

        LocalDate startDate = LocalDate.parse(request.getStartDate());
        LocalDate endDate = LocalDate.parse(request.getEndDate());

        int totalDays = calculateTripDays(startDate, endDate);
        int placesPerDay = Math.max(1, places.size() / totalDays);

        List<TripRecommendResponse> tripPlans = new ArrayList<>();

        for (int i = 0; i < totalDays; i++) {
            int startIdx = i * placesPerDay;
            int endIdx = Math.min(startIdx + placesPerDay, places.size());

            List<Place> subList = places.subList(startIdx, endIdx);

            List<TripRecommendResponse.PlaceInfo> placeInfos = subList.stream()
                .map(p -> new TripRecommendResponse.PlaceInfo(
                    p.getId(), p.getName(), p.getDescription(), p.getLatitude(), p.getLongitude(), p.getImageUrl()))
                .collect(Collectors.toList());

            tripPlans.add(new TripRecommendResponse(i + 1, placeInfos, startDate, endDate)); // ✅ 날짜 포함
        }

        return tripPlans;
    }

    private int calculateTripDays(LocalDate startDate, LocalDate endDate) {
        return (int) ChronoUnit.DAYS.between(startDate, endDate) + 1;
    }
}
