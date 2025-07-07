/*
package com.ssdam.tripPaw.tripPlan;

import com.ssdam.tripPaw.domain.TripPlan;
import com.ssdam.tripPaw.dto.TripRecommendRequest;
import com.ssdam.tripPaw.dto.TripRecommendResponse;
import com.ssdam.tripPaw.dto.TripSaveRequest;
import com.ssdam.tripPaw.tripPlan.config.TripFileUploadService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequiredArgsConstructor
public class TripPlanController {

    private final TripPlanService tripRecommendService;
    private final TripFileUploadService fileUploadService;
    private final TripPlanService tripPlanService;

    // 여행 경로 추천 받기
    @PostMapping("/tripPlan/recommend")
    public List<TripRecommendResponse> recommendTrip(@RequestBody TripRecommendRequest request) {
        return tripRecommendService.recommend(request);
    }
    
    // 여행 경로 썸네일 저장
    @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
    @PostMapping("/tripPlan/upload-thumbnail")
    public ResponseEntity<Map<String, String>> uploadTripImage(@RequestBody Map<String, String> request) {
        String imageUrl = request.get("imageUrl");
        if (imageUrl == null || imageUrl.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "imageUrl is required"));
        }

        String savedUrl = fileUploadService.downloadAndSaveImageFromUrl(imageUrl); // 이 메서드 구현 필요
        return ResponseEntity.ok(Map.of("imageUrl", savedUrl));
    }
    
    // 여행 경로 저장하기
    @PostMapping("/tripPlan/save")
    public void saveTrip(@RequestBody TripSaveRequest request) {
        tripRecommendService.saveTrip(request);
    }
    
    //여행 경로 확인하기
    @GetMapping("/tripPlan/list")
    public List<TripPlan> getAllTrips() {
        return tripPlanService.getAllTrips(); // 서비스단 구현 필요
    }
}
*/
package com.ssdam.tripPaw.tripPlan;

import com.ssdam.tripPaw.domain.TripPlan;
import com.ssdam.tripPaw.dto.TripRecommendRequest;
import com.ssdam.tripPaw.dto.TripRecommendResponse;
import com.ssdam.tripPaw.dto.TripSaveRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequiredArgsConstructor
@RequestMapping("/tripPlan")
public class TripPlanController {

    private final TripPlanService tripPlanService;

    /**
     * 여행 경로 추천 받기
     */
    @PostMapping("/recommend")
    public ResponseEntity<List<TripRecommendResponse>> recommendTrip(@RequestBody TripRecommendRequest request) {
        List<TripRecommendResponse> result = tripPlanService.recommend(request);
        return ResponseEntity.ok(result);
    }

    /**
     * 여행 경로 저장 (지도 이미지 포함)
     */
    @PostMapping("/save")
    public ResponseEntity<String> saveTrip(@RequestBody TripSaveRequest request) {
        try {
            tripPlanService.saveMemberTrip(request);
            return ResponseEntity.ok("✅ 여행 저장 완료!");
        } catch (Exception e) {
            String msg = "❌ 여행 저장 실패: " + e.getMessage();
            System.err.println(msg);
            return ResponseEntity.internalServerError().body(msg);
        }
    }
    
    @PostMapping("/edit")
    public ResponseEntity<Map<String, Object>> editTrip(@RequestBody TripSaveRequest request) {
        try {
            TripPlan tripPlan = tripPlanService.saveTrip(request); // 🛠 service가 TripPlan 반환하도록 변경
            return ResponseEntity.ok(Map.of(
                "message", "✅ 여행 저장 완료!",
                "tripId", tripPlan.getId() // 🧭 프론트에 ID 보내주기
            ));
        } catch (Exception e) {
            String msg = "❌ 여행 저장 실패: " + e.getMessage();
            System.err.println(msg);
            return ResponseEntity.internalServerError().body(Map.of("error", msg));
        }
    }

    /**
     * 특정 ID의 여행 경로 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<TripPlan> getTripById(@PathVariable Long id) {
        TripPlan plan = tripPlanService.findByIdWithCourses(id);
        if (plan == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(plan);
    }

    /**
     * 저장된 여행 목록 전체 조회
     */
    @GetMapping("/list")
    public ResponseEntity<List<TripPlan>> getAllTrips() {
        List<TripPlan> plans = tripPlanService.getAllTrips();
        return ResponseEntity.ok(plans);
    }
}

