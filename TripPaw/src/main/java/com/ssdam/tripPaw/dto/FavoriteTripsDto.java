package com.ssdam.tripPaw.dto;

import com.ssdam.tripPaw.domain.Review;
import com.ssdam.tripPaw.domain.TripPlanCourse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteTripsDto {
    private Long favoriteId;        // 즐겨찾기 ID
    private Long memberId;          // 사용자 ID
    private Long tripPlanId;        // 즐겨찾기된 TripPlan ID
    private String title;           // 여행 제목
    private int days;               // 여행 일수
    private boolean publicVisible;  // 공개 여부
    private LocalDateTime createdAt; // 생성일시
    private String imageUrl;        // 대표 이미지

    private List<TripPlanCourse> tripPlanCourses; // 여행 코스 목록
    private List<Review> reviews;                 // 리뷰 목록

    private Double avgRating;      // 평균 평점
    private Long reviewCount;      // 리뷰 수
}
