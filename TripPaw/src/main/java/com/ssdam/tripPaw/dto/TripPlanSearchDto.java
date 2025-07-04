package com.ssdam.tripPaw.dto;

import com.ssdam.tripPaw.domain.Review;
import com.ssdam.tripPaw.domain.TripPlanCourse;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TripPlanSearchDto {
    private Long id;
    private String title;
    private int days;
    private boolean publicVisible;
    private LocalDateTime createdAt;
    private String imageUrl;

    private List<TripPlanCourse> tripPlanCourses;
    private List<Review> reviews;

    private Double avgRating;
    private Long reviewCount;
}
