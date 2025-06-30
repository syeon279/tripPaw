package com.ssdam.tripPaw.place;

import org.apache.ibatis.annotations.Mapper;

import com.ssdam.tripPaw.domain.PlaceType;

@Mapper
public interface PlaceTypeMapper {
    PlaceType findByName(String name);
    void insert(PlaceType placeType);
}
