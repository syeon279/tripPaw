package com.ssdam.tripPaw.review;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssdam.tripPaw.domain.Review;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
	private final ReviewService reviewService;
	
	// AI 리뷰 자동 생성
	@PostMapping("/generate")
    public ResponseEntity<Map<String, String>> generateReview(@RequestBody Map<String, List<String>> body) {
        List<String> keywords = body.get("keywords");
        String generated = reviewService.generateAIReview(keywords);
        return ResponseEntity.ok(Map.of("content", generated));
    }
	
	// 리뷰 생성 (place / plan 타입 모두 처리)
	@PostMapping
    public ResponseEntity<String> createReview(@RequestBody Map<String, Object> request) {
        try {
            String type = (String) request.get("type");

            String weatherCondition;
            if ("plan".equals(type)) {
                String date = (String) request.get("startDate"); // yyyy-MM-dd
                String hour = (String) request.getOrDefault("startHour", "00"); // 기본값 00
                Long planId = Long.parseLong(request.get("targetId").toString());
                weatherCondition = reviewService.getWeatherByPlanId(planId, date, hour);
            } else if ("place".equals(type)) {
                String date = (String) request.get("reservationDate");
                Long placeId = Long.parseLong(request.get("targetId").toString());
                weatherCondition = reviewService.getWeatherByPlaceId(placeId, date);
            } else {
                return ResponseEntity.badRequest().body("유효하지 않은 리뷰 타입입니다.");
            }

            reviewService.saveReview(request, weatherCondition);
            return ResponseEntity.ok("리뷰가 성공적으로 저장되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("리뷰 저장 중 오류가 발생했습니다.");
        }
    }
	
	// 리뷰 수정
    @PutMapping("/{id}")
    public ResponseEntity<String> updateReview(@PathVariable Long id, @RequestBody Review review) {
        review.setId(id);
        reviewService.updateReview(review);
        return ResponseEntity.ok("리뷰가 수정되었습니다.");
    }

    // 리뷰 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable Long id) {
        Review review = reviewService.getReview(id);
        if (review == null) {
            return ResponseEntity.notFound().build();
        }
        reviewService.deleteReview(review);
        return ResponseEntity.ok("리뷰가 삭제되었습니다.");
    }

    // 리뷰 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<Review> getReview(@PathVariable Long id) {
        Review review = reviewService.getReview(id);
        if (review == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(review);
    }

    // 특정 회원의 리뷰 목록 조회
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Review>> getMemberReviews(@PathVariable Long memberId) {
        List<Review> reviews = reviewService.getMemberReviews(memberId);
        return ResponseEntity.ok(reviews);
    }
}
