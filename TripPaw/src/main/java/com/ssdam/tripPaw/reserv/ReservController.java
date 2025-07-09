package com.ssdam.tripPaw.reserv;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.ssdam.tripPaw.domain.Reserv;

import lombok.RequiredArgsConstructor;

@CrossOrigin(
		  origins = "http://localhost:3000",
		  allowCredentials = "true"
		)
@Controller
@RequestMapping("/reserv")
@RequiredArgsConstructor
public class ReservController {
    private final ReservService reservService;
    private final ReservMapper reservMapper;

    /** 예약 생성 */
    @PostMapping
    public ResponseEntity<Reserv> createReserv(@RequestBody Reserv reserv) {
        try {
            Reserv savedReserv = reservService.saveReserv(reserv);
            if (savedReserv != null) {
                return ResponseEntity.ok(savedReserv);
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /** 단일 예약 조회 */
    @GetMapping("/{id}")
    public ResponseEntity<Reserv> getReserv(@PathVariable Long id) {
        Reserv reserv = reservService.findById(id);
        if (reserv != null) {
            return ResponseEntity.ok(reserv);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /** 전체 예약 조회 */
    @GetMapping
    public ResponseEntity<List<Reserv>> getAllReserv(@RequestParam(required = false) Long tripPlanId) {
        // 모든 예약 가져오기
        List<Reserv> reservList = reservService.findAll();

        // 예약 상태를 변경
        reservList.forEach(r -> {
            // 만료된 예약 처리
            if (r.getExpireAt() != null 
                && r.getExpireAt().isBefore(LocalDate.now()) 
                && r.getState() == ReservState.WAITING) {
                
                // 특정 트립 플랜에 속하는 예약만 처리
                if (tripPlanId == null || r.getTripPlan().getId().equals(tripPlanId)) {
                    r.setState(ReservState.EXPIRED);
                    reservService.updateReservState(r.getId(), ReservState.EXPIRED);
                }
            }
        });

        return ResponseEntity.ok(reservList);
    }

    @GetMapping("/tripplan/{tripPlanId}")
    public ResponseEntity<List<Reserv>> getReservListByTripPlan(@PathVariable Long tripPlanId) {
        List<Reserv> reservList = reservMapper.findByTripPlansId(tripPlanId);
        return ResponseEntity.ok(reservList);
    }
    
    /** 예약 상태 변경 */
    @PatchMapping("/{id}/state")
    public ResponseEntity<String> updateReservState(
            @PathVariable Long id,
            @RequestParam ReservState state) {
        try {
            int result = reservService.updateReservState(id, state);
            return ResponseEntity.ok("예약 상태가 변경되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/disabled-dates")
    public ResponseEntity<List<Map<String, String>>> getDisabledDates(@RequestParam Long placeId) {
        List<Map<String, Object>> rawRanges = reservMapper.findReservedRangesByPlace(placeId);

        List<Map<String, String>> result = rawRanges.stream()
            .map(row -> {
                Map<String, String> map = new HashMap<>();
                Object start = row.get("start_date");
                Object end = row.get("end_date");

                if (start != null && end != null) {
                    map.put("startDate", start.toString());
                    map.put("endDate", end.toString());
                }
                return map;
            })
            .filter(m -> m.containsKey("startDate") && m.containsKey("endDate"))
            .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }


    /** 예약 삭제 */
    @PostMapping("/{id}/delete")
    public ResponseEntity<String> softDelete(@PathVariable Long id) {
        try {
            reservService.softDeleteReservation(id);
            return ResponseEntity.ok("예약이 삭제 처리되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("삭제 실패: " + e.getMessage());
        }
    }
    
    /** 일괄 취소 */
    @PostMapping("/tripPlan/{tripPlanId}/delete")
    public ResponseEntity<String> cancelAllReservations(@PathVariable Long tripPlanId) {
        try {
            // tripPlanId에 해당하는 예약들 조회
            List<Reserv> reservList = reservMapper.findByTripPlansId(tripPlanId);
            
            if (reservList.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 tripPlanId에 대한 예약이 없습니다.");  // 예약이 없으면 404
            }

            // 트랜잭션을 통해 예약 상태를 'CANCELLED'로 일괄 변경
            for (Reserv reserv : reservList) {
                if (!reserv.getTripPlan().getId().equals(tripPlanId)) {
                    // 같은 tripPlanId를 가지지 않는 예약은 취소하지 않음
                    continue;
                }
                reserv.setState(ReservState.CANCELLED);  // 상태 변경
                reservService.updateReservState(reserv.getId(), ReservState.CANCELLED);  // 예약 상태 업데이트
            }

            return ResponseEntity.ok("일괄 예약 취소가 완료되었습니다.");  // 성공 메시지 반환

        } catch (Exception e) {
            // 예외 처리 로깅 추가
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("일괄 예약 취소에 실패했습니다. 오류: " + e.getMessage());  // 실패 메시지
        }
    }
}
