package com.ssdam.tripPaw.pay;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.ssdam.tripPaw.domain.Pay;

@Mapper
public interface PayMapper {
	public Pay findById(Long id);
	public List<Pay> findAll();
	public int insert(Pay pay);
	public int updateByState(Pay pay);
	public int delete(Long id);
}
