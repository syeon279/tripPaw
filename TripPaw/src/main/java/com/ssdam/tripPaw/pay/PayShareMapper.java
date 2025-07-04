package com.ssdam.tripPaw.pay;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.ssdam.tripPaw.domain.PayShare;

@Mapper
public interface PayShareMapper {
	public PayShare findById(Long id);
	public List<PayShare> findAll();
	public int insert(PayShare paygroup);
	public int delete(Long id);
}
