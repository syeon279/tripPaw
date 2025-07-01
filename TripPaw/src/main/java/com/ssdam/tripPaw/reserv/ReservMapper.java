package com.ssdam.tripPaw.reserv;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.ssdam.tripPaw.domain.Reserv;

@Mapper
public interface ReservMapper {
	public Reserv findById(Long id);
	public List<Reserv> findAll();
	public int insert(Reserv reserv);
	public int updateByState(Reserv reserv);
	public int softDelete(Long id);
}
