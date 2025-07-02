package com.ssdam.tripPaw.reserv;

import java.time.LocalDate;
import java.util.List;

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

	boolean existsOverlappingReservation(@Param("memberId") Long memberId, @Param("placeId") Long placeId,
			@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

	Reserv findByIdWithPlace(@Param("id") long targetId);
}