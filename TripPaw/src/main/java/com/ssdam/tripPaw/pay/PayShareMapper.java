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
	
    int update(PayShare payShare); // 결제 상태 갱신
    int countUnpaidByPayId(Long payId); // 결제 안한 인원 수
    List<PayShare> findByPayId(Long payId); // Pay 기준 전체 조회
}
