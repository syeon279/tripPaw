package com.ssdam.tripPaw.place;

import com.ssdam.tripPaw.dto.TripRecommendRequest;
import com.ssdam.tripPaw.dto.TripRecommendResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequiredArgsConstructor
@RequestMapping("/place")
public class TripRecommendController {

    private final TripRecommendService tripRecommendService;

    @PostMapping("/recommend")
    public List<TripRecommendResponse> recommendTrip(@RequestBody TripRecommendRequest request) {
        return tripRecommendService.recommend(request);
    }
}
