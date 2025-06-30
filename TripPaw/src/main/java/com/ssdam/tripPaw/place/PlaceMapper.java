package com.ssdam.tripPaw.place;

import com.ssdam.tripPaw.domain.Place;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PlaceMapper {

    // 삽입
    int insert(Place place);

    // 전체 조회
    List<Place> findAll();

    // ID로 조회
    Place findById(Long id);

    // 업데이트
    int update(Place place);
}
