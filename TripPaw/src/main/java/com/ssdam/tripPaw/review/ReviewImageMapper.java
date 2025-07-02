package com.ssdam.tripPaw.review;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ReviewImageMapper {
	void insertReviewImage(@Param("reviewId") Long reviewId, 
			@Param("imageUrl") String imageUrl);
	
	void deleteImagesByReviewId(@Param("reviewId") Long reviewId);
	
	List<String> findImageUrlsByReviewId(@Param("reviewId") Long reviewId);
}
