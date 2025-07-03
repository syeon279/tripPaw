package com.ssdam.tripPaw.review;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MemberBadgeMapper {
	void updateBadges(@Param("memberId") Long memberId, @Param("badgeId") Long badgeId);
}
