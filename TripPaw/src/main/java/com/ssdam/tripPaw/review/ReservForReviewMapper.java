package com.ssdam.tripPaw.review;

import com.ssdam.tripPaw.domain.Reserv;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ReservForReviewMapper {

    Reserv findOneByMemberAndPlace(@Param("memberId") Long memberId, @Param("placeId") Long placeId);

    int countByMemberAndPlace(@Param("memberId") Long memberId, @Param("placeId") Long placeId);

    int countByMemberAndTripPlan(@Param("memberId") Long memberId, @Param("tripPlanId") Long tripPlanId);
    
    List<Reserv> findByTripPlanIdAndMember(@Param("tripPlanId") Long tripPlanId, @Param("memberId") Long memberId);
    
//    List<ReservWithReviewDto> findAllWithReviewStatus(Long memberId);

    Reserv findReservByMemberAndTripPlan(@Param("tripPlanId") Long tripPlanId, @Param("memberId") Long memberId);

	int countByMemberAndPlace(@Param("memberId") Long memberId,
	 @Param("placeId") Long placeId);

}