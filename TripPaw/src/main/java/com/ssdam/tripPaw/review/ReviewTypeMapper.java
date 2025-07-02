package com.ssdam.tripPaw.review;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.ssdam.tripPaw.domain.ReviewType;

@Mapper
public interface ReviewTypeMapper {
	ReviewType findById(Long id);
}
