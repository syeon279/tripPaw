package com.ssdam.tripPaw.reserv;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.ssdam.tripPaw.domain.Reserv;

@Mapper
public interface ReservMapper {
	public Reserv findById(Long id);

	public List<Reserv> findAll();

	public int insert(Reserv reserv);

	public int updateByState(Reserv reserv);

	public int softDelete(Long id);

	public boolean existsOverlappingReservation(@Param("memberId") Long memberId, @Param("placeId") Long placeId,
			@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

	public Reserv findByIdWithPlace(@Param("id") long targetId);
	
	public List<Map<String, Object>> findActiveReservedRanges();
	
	public  List<Reserv> findByTripPlanIdAndMember(@Param("tripPlanId") Long tripPlanId, @Param("memberId") Long memberId);
}