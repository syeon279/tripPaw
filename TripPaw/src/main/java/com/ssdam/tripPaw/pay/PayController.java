package com.ssdam.tripPaw.pay;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.ssdam.tripPaw.payapi.IamportPayService;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/api/pay")
@RequiredArgsConstructor
public class PayController {
    @Autowired private IamportPayService iamportPayService;

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
        @RequestParam String impUid,
        @RequestParam Long reservId,
        @RequestParam Long memberId
    ) {
        try {
            int result = iamportPayService.verifyAndSavePayment(impUid, reservId, memberId);
            return ResponseEntity.ok("결제 검증 및 저장 완료");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("결제 검증 실패: " + e.getMessage());
        }
    }
}
