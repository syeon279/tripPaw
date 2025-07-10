package com.ssdam.tripPaw.review;

import com.ssdam.tripPaw.domain.Reserv;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ReservForReviewMapper {

    Reserv findOneByMemberAndPlace(@Param("memberId") Long memberId, @Param("placeId") Long placeId);

    int countByMemberAndPlace(@Param("memberId") Long memberId, @Param("placeId") Long placeId);

    int countByMemberAndTripPlan(@Param("memberId") Long memberId, @Param("tripPlanId") Long tripPlanId);
}