package com.ssdam.tripPaw.reserv;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.MemberTripPlan;
import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.Reserv;
import com.ssdam.tripPaw.dto.TripPlanCoursePlaceDto;
import com.ssdam.tripPaw.place.PlaceMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequestMapping("/reserv")
@RequiredArgsConstructor
public class ReservService {
    private final ReservMapper reservMapper;
    private final PlaceMapper placeMapper;

    /** 예약 생성 */
    @Transactional
    public Reserv saveReserv(Reserv reserv) {
        reserv.setCreatedAt(LocalDateTime.now());

        if (reserv.getExpireAt() == null) {
            reserv.setExpireAt(LocalDate.now().plusDays(5));
        }

        // 중복 예약 체크
        boolean exists = reservMapper.existsOverlappingReservation(
            reserv.getMember().getId(),
            reserv.getPlace().getId(),
            reserv.getStartDate(),
            reserv.getEndDate()
        );
        if (exists) {
            throw new IllegalStateException("해당 기간에 이미 예약이 존재합니다.");
        }

        int result = reservMapper.insert(reserv);
        if (result > 0) {
            // insert 후 예약 객체에 생성된 id가 들어있어야 함 (MyBatis에 따라 다름)
            return reserv;
        } else {
            return null;
        }
    }

    /** 예약 조회 */
    public Reserv findById(Long id) {
    	Reserv reserv = reservMapper.findByIdWithPlace(id);
        if (reserv == null || reserv.getDeleteAt() != null) {
            throw new IllegalArgumentException("존재하지 않거나 삭제된 예약입니다.");
        }
        return reserv;
    }

    /** 예약 전체 조회 */
    public List<Reserv> findAll() {
        return reservMapper.findAll();
    }

    public List<Reserv> findByTripPlansId(Long tripPlanId) {
        return reservMapper.findByTripPlansId(tripPlanId);  // MyBatis 매퍼 호출
    }
    
    public List<Reserv> findByMemberTripPlanIdAndMember(Long memberTripPlanId, Long memberId) {
        return reservMapper.findByMemberTripPlanIdAndMember(memberTripPlanId, memberId);
    }
    
    public MemberTripPlan findMemberTripPlanById(Long id) {
        return reservMapper.findMemberTripPlanById(id);
    }
    
    @Transactional
    public List<Reserv> createReservationsFromTripPlanByUserId(Long userId) {
        Member member = reservMapper.findMemberById(userId);
        if (member == null) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다.");
        }
        
        List<TripPlanCoursePlaceDto> courseList = reservMapper.findCoursesByMemberId(member.getId());
        
        List<Reserv> savedList = new ArrayList<>();
        LocalDate baseDate = LocalDate.now();

        for (int i = 0; i < courseList.size(); i++) {
            TripPlanCoursePlaceDto dto = courseList.get(i);

            Place place = placeMapper.findById(dto.getPlaceId());
            MemberTripPlan memberTripPlan = reservMapper.findMemberTripPlanById(dto.getMemberTripPlanId());

            if (place == null || memberTripPlan == null) continue;

            dto.setStartDate(baseDate.plusDays(i));
            dto.setEndDate(baseDate.plusDays(i + 1));

            Reserv reserv = dto.toReserv(member, place, memberTripPlan);

            if (!reservMapper.existsOverlappingReservation(
                    member.getId(), place.getId(), reserv.getStartDate(), reserv.getEndDate())) {

                reservMapper.insert(reserv);
                savedList.add(reserv);
            }
        }

        return savedList;
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
