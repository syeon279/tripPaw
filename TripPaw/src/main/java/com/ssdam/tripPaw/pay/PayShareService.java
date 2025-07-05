package com.ssdam.tripPaw.pay;

import java.time.LocalDateTime;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.Pay;
import com.ssdam.tripPaw.domain.PayShare;
import com.ssdam.tripPaw.domain.Reserv;
import com.ssdam.tripPaw.reserv.ReservMapper;
import com.ssdam.tripPaw.reserv.ReservState;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PayShareService {
	
	private final PayShareMapper payShareMapper;
	private final PayMapper payMapper;
	private final ReservMapper reservMapper;
	
    public List<PayShare> findAll() {
        return payShareMapper.findAll();
    }
    
    public PayShare findById(Long payId) {
        return payShareMapper.findById(payId);
    }

    public void insert(PayShare payShare) {
        payShare.setCreatedAt(LocalDateTime.now());
        payShareMapper.insert(payShare);
    }
    
    public void delete(Long id) {
        payShareMapper.delete(id);
    }
    
    
    @Transactional
    public Pay createDutchPay(Long reservId, Member owner, List<Member> participants) {
        Reserv reserv = reservMapper.findById(reservId);
        if (reserv == null) {
            throw new IllegalArgumentException("예약 정보를 찾을 수 없습니다.");
        }

        int totalAmount = reserv.getFinalPrice();
        int shareAmount = totalAmount / participants.size();

        Pay pay = new Pay();
        pay.setReserv(reserv);
        pay.setMember(owner);  // 방장
        pay.setAmount(totalAmount);
        pay.setPayMethod("DUTCH");
        pay.setPgProvider("DUTCH");
        pay.setState(PayState.READY);
        pay.setCreatedAt(LocalDateTime.now());
        pay.setHaspayShare(true);

        payMapper.insert(pay);

        for (Member participant : participants) {
            PayShare payShare = new PayShare();
            payShare.setPay(pay);
            payShare.setMember(participant);
            payShare.setAmount(shareAmount);
            payShare.setHasPaid(false);
            payShare.setCreatedAt(LocalDateTime.now());
            payShareMapper.insert(payShare); // 이 부분은 payShareMapper 필요
        }

        return pay;
    }
    
    @Transactional
    public void completePayShare(Long payShareId, Member member) {
        PayShare payShare = payShareMapper.findById(payShareId);
        if (payShare == null) {
            throw new IllegalArgumentException("결제 항목이 존재하지 않습니다.");
        }

        if (!payShare.getMember().getId().equals(member.getId())) {
            throw new IllegalArgumentException("본인의 결제가 아닙니다.");
        }

        payShare.setHasPaid(true);
        payShare.setPaidAt(LocalDateTime.now());
        payShareMapper.update(payShare);

        // 모든 참여자가 결제 완료했는지 확인
        Long payId = payShare.getPay().getId();
        int unpaidCount = payShareMapper.countUnpaidByPayId(payId);

        if (unpaidCount == 0) {
            Pay pay = payMapper.findById(payId);
            pay.setState(PayState.PAID);
            payMapper.updateByState(pay);

            // 예약 상태도 CONFIRMED로 변경
            Reserv reserv = pay.getReserv();
            reserv.setState(ReservState.CONFIRMED);
            reservMapper.updateByState(reserv);
        }
    }
    
}
