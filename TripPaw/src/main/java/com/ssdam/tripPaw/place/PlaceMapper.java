package com.ssdam.tripPaw.place;

import com.ssdam.tripPaw.domain.Place;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Mapper
public interface PlaceMapper {

    // 삽입
    int insert(Place place);

    // 전체 조회
    List<Place> findAll();

    // ID로 조회
    Place findById(Long id);
    Place findByIdWithAll(Long id);

    List<Place> findRecommendedPlacesByRandom(
    	    @Param("region") String region,
    	    @Param("categoryIds") List<Long> categoryIds
    	);

    Place findFirstRandomPlace(@Param("region") String region, @Param("categoryIds") List<Long> categoryIds);

    List<Place> findPlacesByTypeAndDistance(
    	    @Param("placeType") int placeType,
    	    @Param("region") String region,
    	    @Param("categoryIds") List<Long> categoryIds,
    	    @Param("baseLat") String baseLat,
    	    @Param("baseLng") String baseLng,
    	    @Param("limit") int limit
    	);
    
    // 업데이트
    int update(Place place);
}
