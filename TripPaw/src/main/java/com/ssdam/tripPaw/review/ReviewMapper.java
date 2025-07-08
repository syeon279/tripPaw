package com.ssdam.tripPaw.review;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.Review;
import com.ssdam.tripPaw.domain.ReviewType;

@Mapper
public interface ReviewMapper {
	void insertReview(Review review);
	
	void updateReview(Review review);
	
	void deleteReview(Review review);
	
	void deleteLikesByReviewId(Long reviewId);
	
	Review findById(@Param("id") Long id);
	
	List<Review> findByMemberId(Long memberId);
	List<MyReviewDto> findMyReviewsByMemberId(Long memberId);
	
	List<Review> findByTarget(@Param("targetId") Long targetId, @Param("reviewTypeId") Long reviewTypeId);
	
//	List<Review> findAll();	//리뷰 전체 조회
	
//	Member findMemberById(Long memberId);
	
	ReviewType findReviewTypeById(@Param("id") Long id);
	
	List<Review> findByPlaceId(Long placeId);
	
	List<Review> findByPlanId(Long planId);
	
	List<Review> findAllPlanReviews();
	
	// 장소의 평균 평점 및 리뷰 수
//    @Select("SELECT ROUND(AVG(rating), 1) FROM review WHERE review_type_id = 2 AND target_id = #{placeId}")
//    Double getAvgRatingForPlace(Long placeId);
//
//    @Select("SELECT COUNT(*) FROM review WHERE review_type_id = 2 AND target_id = #{placeId}")
//    int getReviewCountForPlace(Long placeId);
	
	// 최신순
	List<ReviewPlanDto> findAllPlanReviewsOrderByCreatedAtDesc();

	// 평점 높은순
	List<ReviewPlanDto> findAllPlanReviewsOrderByRatingDesc();

	// 평점 낮은순
	List<ReviewPlanDto> findAllPlanReviewsOrderByRatingAsc();

	// 추천순
	List<ReviewPlanDto> findAllPlanReviewsOrderByLikesDesc();
	//도움이돼요
	void likeReview(@Param("memberId") Long memberId, @Param("reviewId") Long reviewId);
	void unlikeReview(@Param("memberId") Long memberId, @Param("reviewId") Long reviewId);
	int countLikes(@Param("reviewId") Long reviewId);
	boolean hasLikedReview(@Param("memberId") Long memberId, @Param("reviewId") Long reviewId);
	
	
	
	// 해당 장소의 평균 별점 가져오기
	Double getAverageRatingByPlaceId(Long id);
	// 해장 당소의 리뷰 개수 가져오기
	Integer getReviewCountByPlaceId(Long id);

}
