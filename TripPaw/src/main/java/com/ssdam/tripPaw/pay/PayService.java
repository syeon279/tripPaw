package com.ssdam.tripPaw.pay;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.siot.IamportRestClient.exception.IamportResponseException;
import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.Pay;
import com.ssdam.tripPaw.domain.PayShare;
import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.Reserv;
import com.ssdam.tripPaw.domain.TripPlan;
import com.ssdam.tripPaw.payapi.IamportPayService;
import com.ssdam.tripPaw.reserv.ReservMapper;
import com.ssdam.tripPaw.reserv.ReservState;
import com.ssdam.tripPaw.tripPlan.TripPlanMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PayService {
    private final PayMapper payMapper;
    private final ReservMapper reservMapper;
    private final IamportPayService iamportPayService;
    private final PayShareMapper payShareMapper;
    private final TripPlanMapper tripPlanMapper;

    // 더미 테스트
    @Transactional
    public Long createDummyTripPlanWithReservs(Member member) {
        // 1. TripPlan 생성
        TripPlan tripPlan = new TripPlan();
        tripPlan.setTitle("테스트 플랜");
        tripPlan.setMember(member);
        tripPlan.setDays(2);
        tripPlan.setCreatedAt(LocalDateTime.now());
        tripPlan.setPublicVisible(false);
        tripPlan.setImageUrl("https://dummyimage.com/600x400/000/fff&text=DummyPlan");

        tripPlanMapper.insertTripPlan(tripPlan);

        // 2. Place 더미 연결 (주의: 실제 존재하는 Place ID 사용)
        Long dummyPlaceId = 1L; // 테스트할 Place ID

        for (int i = 0; i < 2; i++) {
            Reserv reserv = new Reserv();
            reserv.setStartDate(LocalDate.now().plusDays(i));
            reserv.setEndDate(LocalDate.now().plusDays(i + 1));
            reserv.setFinalPrice(10000 * (i + 1));
            reserv.setOriginalPrice(12000 * (i + 1));
            reserv.setCountPeople(2);
            reserv.setCountPet(1);
            reserv.setState(ReservState.WAITING);
            reserv.setCreatedAt(LocalDateTime.now());
            reserv.setMember(member);

            Place dummyPlace = new Place();
            dummyPlace.setId(dummyPlaceId);
            reserv.setPlace(dummyPlace);

            reserv.setTripPlan(tripPlan);

            reservMapper.insert(reserv);
        }

        return tripPlan.getId();
    }
    
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


    /** 일괄 결제 */
    @Transactional
    public List<Pay> createBatchPaysByTripPlan(Long tripPlanId, Member member) {
        // 1. tripPlanId에 속한 예약 목록 조회
        List<Reserv> reservList = reservMapper.findByTripPlanIdAndMember(tripPlanId, member.getId());
        if (reservList.isEmpty()) {
            throw new RuntimeException("예약이 없습니다.");
        }

        List<Pay> payList = new ArrayList<>();
        
        for (Reserv reserv : reservList) {
            Pay pay = new Pay();
            pay.setReserv(reserv);
            pay.setMember(member);
            pay.setAmount(reserv.getFinalPrice());
            pay.setState(PayState.READY);
            payList.add(pay);
        }

        for (Pay pay : payList) {
            payMapper.insert(pay);
        }
        return payList;
    }
    
    @Transactional
    public void createAndVerifySingleTotalPayment(Long tripPlanId, Member member, String impUid) throws Exception {
        // 1. tripPlanId에 속한 예약 목록 조회
        List<Reserv> reservList = reservMapper.findByTripPlanIdAndMember(tripPlanId, member.getId());
        if (reservList.isEmpty()) {
            throw new RuntimeException("예약이 없습니다.");
        }

        // 2. 예약 ID 목록 추출
        Set<Long> reservIds = reservList.stream().map(Reserv::getId).collect(Collectors.toSet());

        // 3. 총합 결제 검증 및 저장 + 예약 상태 변경 + Pay 매핑까지 수행
        iamportPayService.verifyAndSaveTotalPayment(impUid, reservIds, member.getId());
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
