package com.ssdam.tripPaw.reserv;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    public ResponseEntity<List<Reserv>> getAllReserv() {
        List<Reserv> reservList = reservService.findAll();

        reservList.forEach(r -> {
            if (r.getExpireAt() != null
                && r.getExpireAt().isBefore(LocalDate.now()) 
                && r.getState() == ReservState.WAITING) {    
                
                r.setState(ReservState.EXPIRED);
                reservService.updateReservState(r.getId(), ReservState.EXPIRED);
            }
        });

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
    public ResponseEntity<List<Map<String, String>>> getDisabledDates() {
        List<Map<String, Object>> rawRanges = reservMapper.findActiveReservedRanges();

        List<Map<String, String>> result = rawRanges.stream().map(row -> {
            Map<String, String> map = new HashMap<>();

            Object start = row.get("start_date");
            Object end = row.get("end_date");

            if (start != null && end != null) {
                map.put("startDate", start.toString());
                map.put("endDate", end.toString());
            }
            return map;
        }).filter(m -> m.containsKey("startDate") && m.containsKey("endDate"))
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
}
