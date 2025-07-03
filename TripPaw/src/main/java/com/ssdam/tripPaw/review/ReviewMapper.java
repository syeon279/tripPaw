package com.ssdam.tripPaw.review;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.Review;
import com.ssdam.tripPaw.domain.ReviewType;

@Mapper
public interface ReviewMapper {
	void insertReview(Review review);
	
	void updateReview(Review review);
	
	void deleteReview(Review review);
	
	Review findById(@Param("id") Long id);
	
	List<Review> findByTarget(@Param("targetId") Long targetId, @Param("reviewTypeId") Long reviewTypeId);
	
	List<Review> findByMemberId(Long memberId);
	
	List<Review> findAll();	//리뷰 전체 조회
	
	Member findMemberById(Long memberId);
	
	ReviewType findReviewTypeById(@Param("id") Long id);
}
