package com.ssdam.tripPaw.pay;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.ssdam.tripPaw.payapi.IamportPayService;
import com.ssdam.tripPaw.reserv.ReservService;

@Controller
@RequestMapping("/pay")
public class PayController {
    @Autowired private IamportPayService iamportPayService;
    @Autowired private ReservService reservService;
    @Autowired private PayService payService;

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
        @RequestParam String impUid,
        @RequestParam Long reservId,
        @RequestParam Long memberId
    ) {
        try {
            int result = iamportPayService.verifyAndSavePayment(impUid, reservId, memberId);
            return ResponseEntity.ok("결제 검증 및 예약 확정 완료");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("결제 검증 실패: " + e.getMessage());
        }
    }
    
    /** 결제 내역 조회 */
    @GetMapping("/{id}")
    public ResponseEntity<?> getPayment(@PathVariable Long id) {
        var pay = payService.findById(id);
        if (pay == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(pay);
    }

    /** 결제 취소(환불) 처리 */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelPayment(@PathVariable Long id) {
        try {
            // 결제 취소 (예: 상태 변경만)
            int updated = payService.updatePayState(id, PayState.CANCELLED);
            if (updated > 0) {
                return ResponseEntity.ok("결제 취소 완료");
            } else {
                return ResponseEntity.badRequest().body("결제 취소 실패");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("오류: " + e.getMessage());
        }
    }
}
