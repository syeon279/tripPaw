package com.ssdam.tripPaw.review;

import lombok.Data;
import java.util.List;

@Data
public class ReviewPlanDto {
    private Long reviewId;
    private String content;
    private int rating;
    private String weatherCondition;
    private String memberNickname; // 작성자 닉네임
    private String planTitle;      // 여행플랜 제목
    private Double avgRating;      // 🔸 평균 별점
    private String imageUrls;
    private int likeCount;
    private Long tripPlanId;
    private Long targetId;
}
