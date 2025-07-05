package com.ssdam.tripPaw.pay;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.Pay;
import com.ssdam.tripPaw.domain.PayShare;
import com.ssdam.tripPaw.member.MemberService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payshare")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PayShareController {

    private final PayShareService payShareService;
    private final MemberService memberService;
    private final PayService payService;

    // 특정 결제의 더치페이 항목 전체 조회
    @GetMapping("/pay/{payId}")
    public PayShare getById(@PathVariable Long payId) {
        return payShareService.findById(payId);
    }

    // 새로운 더치페이 항목 추가
    @PostMapping
    public void addPayShare(@RequestBody PayShare payShare) {
        payShareService.insert(payShare);
    }

    // 삭제
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        payShareService.delete(id);
    }
    
    // 더치페이
    @PostMapping("/dutch/create/{reservId}")
    public ResponseEntity<?> createDutchPay(@PathVariable Long reservId,
                                            @RequestBody List<Long> participantIds,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        Member owner = memberService.findByUsername(userDetails.getUsername());
        List<Member> participants = memberService.findAllByIds(participantIds);
        Pay pay = payShareService.createDutchPay(reservId, owner, participants);
        return ResponseEntity.ok(pay);
    }

    @PostMapping("/dutch/pay/{payShareId}")
    public ResponseEntity<?> completeDutchPay(@PathVariable Long payShareId,
                                              @AuthenticationPrincipal UserDetails userDetails) {
        Member member = memberService.findByUsername(userDetails.getUsername());
        payShareService.completePayShare(payShareId, member);
        return ResponseEntity.ok("결제 완료");
    }
}
