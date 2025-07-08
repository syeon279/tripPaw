package com.ssdam.tripPaw.pay;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import com.ssdam.tripPaw.domain.PayShare;

@Mapper
public interface PayShareMapper {
	public PayShare findById(Long id);
	public List<PayShare> findAll();
	public int insert(PayShare paygroup);
	public int delete(Long id);
	
	PayShare findByPayIdAndMemberId(@Param("payId") Long payId, @Param("memberId") Long memberId);
	int countByPayId(@Param("payId") Long payId);
    int update(PayShare payShare);
    int countUnpaidByPayId(Long payId);
    List<PayShare> findByPayId(@Param("payId") Long payId);
    PayShare findByReservIdAndMember(@Param("reservId") Long reservId, @Param("memberId") Long memberId);
}
