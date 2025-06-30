package com.ssdam.tripPaw.pay;

import java.util.List;

import com.ssdam.tripPaw.domain.PayGroup;

public interface PayGroupMapper {
	public PayGroup findById(Long id);
	public List<PayGroup> findAll();
	public int insert(PayGroup paygroup);
	public int delete(Long id);
}
