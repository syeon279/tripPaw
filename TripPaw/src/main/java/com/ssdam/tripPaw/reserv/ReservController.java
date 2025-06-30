package com.ssdam.tripPaw.reserv;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
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

@Controller
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservController {
    private final ReservService reservService;

    /** 예약 생성 */
    @PostMapping
    public ResponseEntity<String> createReserv(@RequestBody Reserv reserv) {
        int result = reservService.createReserv(reserv);
        if (result > 0) {
            return ResponseEntity.ok("예약이 생성되었습니다.");
        } else {
            return ResponseEntity.badRequest().body("예약 생성에 실패했습니다.");
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

    /** 예약 삭제 */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReserv(@PathVariable Long id) {
        int result = reservService.deleteReserv(id);
        if (result > 0) {
            return ResponseEntity.ok("예약이 삭제되었습니다.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
