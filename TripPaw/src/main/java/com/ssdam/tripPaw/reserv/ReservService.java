package com.ssdam.tripPaw.reserv;

import java.time.LocalDateTime;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.Reserv;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReservService {
    private final ReservMapper reservMapper;

    /** 예약 생성 */
    @Transactional
    public int createReservation(Reserv reserv) {
        reserv.setCreatedAt(LocalDateTime.now());
        return reservMapper.insert(reserv);
    }

    /** 예약 조회 */
    public Reserv findById(Long id) {
        return reservMapper.findById(id);
    }

    /** 예약 전체 조회 */
    public List<Reserv> findAll() {
        return reservMapper.findAll();
    }

    /** 예약 상태 업데이트 */
    @Transactional
    public int updateReservationState(Long reservId, ReservState newState) {
        Reserv reserv = reservMapper.findById(reservId);
        if (reserv == null) {
            throw new IllegalArgumentException("예약을 찾을 수 없습니다: " + reservId);
        }

        reserv.setState(newState);
        return reservMapper.updateByState(reserv);
    }

    /** 예약 삭제 */
    @Transactional
    public int deleteReservation(Long id) {
        return reservMapper.delete(id);
    }
}
