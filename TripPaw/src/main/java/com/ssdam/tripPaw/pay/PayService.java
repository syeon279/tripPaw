package com.ssdam.tripPaw.pay;

import java.time.LocalDateTime;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.Pay;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PayService {
    private final PayMapper payMapper;

    /** 결제 조회 */
    public Pay findById(Long id) {
        return payMapper.findById(id);
    }

    /** 결제 전체 조회 */
    public List<Pay> findAll() {
        return payMapper.findAll();
    }

    /** 결제 정보 저장 */
    @Transactional
    public int createPay(Pay pay) {
        if (pay.getCreatedAt() == null) {
            pay.setCreatedAt(LocalDateTime.now());
        }
        return payMapper.insert(pay);
    }

    /** 결제 상태 업데이트 (예: 결제 완료 → 환불 등) */
    @Transactional
    public int updatePayState(Long id, PayState newState) {
        Pay pay = payMapper.findById(id);
        if (pay == null) {
            throw new IllegalArgumentException("해당 결제 내역이 존재하지 않습니다: " + id);
        }

        pay.setState(newState);
        return payMapper.updateByState(pay);
    }

    /** 결제 삭제 */
    @Transactional
    public int deletePay(Long id) {
        return payMapper.delete(id);
    }
}
