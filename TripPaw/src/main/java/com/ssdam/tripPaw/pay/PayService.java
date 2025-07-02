package com.ssdam.tripPaw.pay;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.siot.IamportRestClient.exception.IamportResponseException;
import com.ssdam.tripPaw.domain.Pay;
import com.ssdam.tripPaw.payapi.IamportPayService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PayService {
    private final PayMapper payMapper;
    private final IamportPayService iamportPayService;

    /** 결제 조회 */
    public Pay findById(Long id) {
        return payMapper.findById(id);
    }

    /** 결제 전체 조회 */
    public List<Pay> findAll() {
        return payMapper.findAll();
    }

    public Pay findByReservId(Long reservId) {
        return payMapper.findByReservId(reservId);
    }
    
    public Pay findByImpUid(String impUid) {
        return payMapper.findByImpUid(impUid);
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
    public int softDelete(Long id) {
        Pay pay = payMapper.findById(id);
        if (pay == null || pay.getDeleteAt() != null) {
            throw new IllegalArgumentException("이미 삭제되었거나 존재하지 않는 결제입니다.");
        }

        return payMapper.softDelete(id);
    }
    
    public boolean refundPayment(String impUid) throws IamportResponseException, IOException {
        // 1. 환불 요청 전에 결제정보 조회
        Pay pay = payMapper.findByImpUid(impUid);
        if (pay == null) {
            throw new RuntimeException("결제 정보가 없습니다.");
        }

        // 2. 아임포트 환불 API 호출
        boolean success = iamportPayService.cancelPayment(impUid, true);

        if (success) {
            // 3. 환불 성공 시 상태를 REFUNDED로 업데이트
            payMapper.updateStateByImpUid(impUid, PayState.REFUNDED.name());
            return true;
        }
        return false;
    }
}
