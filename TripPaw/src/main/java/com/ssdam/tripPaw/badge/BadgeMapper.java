package com.ssdam.tripPaw.badge;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import com.ssdam.tripPaw.domain.Badge;

@Mapper
public interface BadgeMapper {
    void insertBadge(Badge badge);
    void updateBadge(Badge badge);
    void deleteBadge(Long id);
    Badge findById(Long id);
    List<Badge> findAll();
}
