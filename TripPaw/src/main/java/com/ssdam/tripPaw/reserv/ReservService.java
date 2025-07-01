package com.ssdam.tripPaw.reserv;

import java.time.LocalDateTime;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.Reserv;
import com.ssdam.tripPaw.place.PlaceMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReservService {
    private final ReservMapper reservMapper;
    private final PlaceMapper placeMapper;

    /** 예약 생성 */
    @Transactional
    public int createReserv(Reserv reserv) {
        reserv.setCreatedAt(LocalDateTime.now());

        // placeId가 Reserv에 있다고 가정
//        Long placeId = reserv.getPlace().getId();
//        Place place = placeMapper.findById(placeId);
//        
//        int pricePerPerson = 0;
//        try {
//            pricePerPerson = Integer.parseInt(place.getPrice());
//        } catch (NumberFormatException e) {
//            // 변환 실패 시 처리 (기본값 설정하거나 예외 던지기)
//            throw new IllegalArgumentException("가격 데이터가 올바른 숫자가 아닙니다: " + place.getPrice());
//        }
//        
//        int originalPrice = pricePerPerson * reserv.getCountPeople();
//        reserv.setOriginalPrice(originalPrice); 

        return reservMapper.insert(reserv);
    }

    /** 예약 조회 */
    public Reserv findById(Long id) {
        Reserv reserv = reservMapper.findById(id);
        if (reserv == null || reserv.getDeleteAt() != null) {
            throw new IllegalArgumentException("존재하지 않거나 삭제된 예약입니다.");
        }
        return reserv;
    }

    /** 예약 전체 조회 */
    public List<Reserv> findAll() {
        return reservMapper.findAll();
    }

    /** 예약 상태 업데이트 */
    @Transactional
    public int updateReservState(Long reservId, ReservState newState) {
        Reserv reserv = reservMapper.findById(reservId);
        if (reserv == null) {
            throw new IllegalArgumentException("예약을 찾을 수 없습니다: " + reservId);
        }

        reserv.setState(newState);
        return reservMapper.updateByState(reserv);
    }

    /** 예약 삭제 */
    @Transactional
    public int softDeleteReservation(Long id) {
        Reserv reserv = reservMapper.findById(id);
        if (reserv == null || reserv.getDeleteAt() != null) {
            throw new IllegalArgumentException("존재하지 않거나 이미 삭제된 예약입니다.");
        }

        return reservMapper.softDelete(id);
    }
}
