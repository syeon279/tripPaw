package com.ssdam.tripPaw.place;

import org.apache.ibatis.annotations.Mapper;

import com.ssdam.tripPaw.domain.PlaceType;

@Mapper
public interface PlaceTypeMapper {
    PlaceType findByName(String name);
    int insert(PlaceType placeType);
}
