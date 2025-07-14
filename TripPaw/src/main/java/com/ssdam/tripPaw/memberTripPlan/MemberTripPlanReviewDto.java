package com.ssdam.tripPaw.memberTripPlan;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class MemberTripPlanReviewDto {
    private Long memberTripPlanId;      // 여행 식별자
    private String titleOverride;       // 커스텀 여행 제목
    private LocalDate startDate;        // 여행 시작일
    private LocalDate endDate;          // 여행 종료일
    private String imageUrl;            // 여행 이미지
    private String status;              // 여행 진행 상태 (PLANED, ONGOING, END)
    private int countPeople;            // 인원수
    private int countPet;               // 반려동물 수
    private boolean publicVisible;      // 공개 여부
}
