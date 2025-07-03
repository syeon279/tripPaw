package com.ssdam.tripPaw.review;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.ssdam.tripPaw.domain.Badge;

@Mapper
public interface MemberBadgeMapper {
	int getTotalContentLengthByMemberId(Long memberId);

    List<Badge> findEligibleBadges(int totalWeight);

    boolean hasBadge(@Param("memberId") Long memberId, @Param("badgeId") Long badgeId);

    void insertBadge(@Param("memberId") Long memberId, @Param("badgeId") Long badgeId);
}
