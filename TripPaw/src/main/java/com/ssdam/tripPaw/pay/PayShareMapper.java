package com.ssdam.tripPaw.pay;

import java.util.List;

import com.ssdam.tripPaw.domain.PayShare;

public interface PayShareMapper {
	public PayShare findById(Long id);
	public List<PayShare> findAll();
	public int insert(PayShare paygroup);
	public int delete(Long id);
}
