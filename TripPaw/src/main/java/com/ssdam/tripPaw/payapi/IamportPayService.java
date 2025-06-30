package com.ssdam.tripPaw.payapi;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;
import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.Pay;
import com.ssdam.tripPaw.domain.Reserv;

import com.ssdam.tripPaw.pay.PayMapper;
import com.ssdam.tripPaw.pay.PayState;
import com.ssdam.tripPaw.reserv.ReservMapper;
import com.ssdam.tripPaw.reserv.ReservService;
import com.ssdam.tripPaw.reserv.ReservState;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IamportPayService {
	
	private final ReservService reservService;
	
    @Value("${iamport.api.key}")
    private String apiKey;

    @Value("${iamport.api.secret}")
    private String apiSecret;

    private IamportClient iamportClient;

    @Autowired private PayMapper payMapper;
    @Autowired private ReservMapper reservMapper;

    @PostConstruct
    public void init() {
        this.iamportClient = new IamportClient(apiKey, apiSecret);
    }

    /** 결제 검증 후 DB 저장 */
    public int verifyAndSavePayment(String impUid, Long reservId, Long memberId) throws IamportResponseException, IOException {
        IamportResponse<Payment> response = iamportClient.paymentByImpUid(impUid);
        Payment payment = response.getResponse();

        // 실제 결제 금액과 예약 확인 등 검증 추가 가능

        // DB 저장
        Pay pay = new Pay();
        pay.setImpUid(payment.getImpUid());
        pay.setMerchantUid(payment.getMerchantUid());
        pay.setAmount(payment.getAmount().intValue());
        pay.setPayMethod(payment.getPayMethod());
        pay.setPgProvider(payment.getPgProvider());
        pay.setPaidAt(payment.getPaidAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
        pay.setCreatedAt(LocalDateTime.now());
        pay.setState(PayState.PAID);

        // 예약/유저 연동
        Reserv reserv = reservMapper.findById(reservId);
        pay.setReserv(reserv);

        Member member = Member.builder().id(memberId).build(); // 최소한 ID만 설정
        pay.setMember(member);

        int result = payMapper.insert(pay);
        
        if (result > 0) {
            reservService.updateReservState(reservId, ReservState.CONFIRMED);
        }
        
        return result;
    }
}
