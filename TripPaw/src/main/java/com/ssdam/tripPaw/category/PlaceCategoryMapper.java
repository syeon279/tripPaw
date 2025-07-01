package com.ssdam.tripPaw.category;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PlaceCategoryMapper {
    Long findIdByName(String name);
}