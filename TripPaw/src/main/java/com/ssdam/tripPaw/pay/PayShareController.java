package com.ssdam.tripPaw.pay;

import com.ssdam.tripPaw.domain.PayShare;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payshare")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PayShareController {

    private final PayShareService payShareService;

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
}
