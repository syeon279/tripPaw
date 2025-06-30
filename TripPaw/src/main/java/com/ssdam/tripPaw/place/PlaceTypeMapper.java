package com.ssdam.tripPaw.place;

import com.ssdam.tripPaw.domain.PlaceType;

public interface PlaceTypeMapper {
    PlaceType findByName(String name);
    void insert(PlaceType placeType);
}
