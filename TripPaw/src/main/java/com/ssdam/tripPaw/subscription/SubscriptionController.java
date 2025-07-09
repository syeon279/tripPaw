package com.ssdam.tripPaw.subscription;

import com.ssdam.tripPaw.domain.Subscription;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/create")
    public void subscribe(@RequestBody Subscription subscription) {
        subscriptionService.subscribe(subscription);
    }

    @GetMapping("/latest/{memberId}")
    public Subscription getLatest(@PathVariable Long memberId) {
        return subscriptionService.getLatestSubscription(memberId);
    }

    @GetMapping("/active/{memberId}")
    public boolean checkActive(@PathVariable Long memberId) {
        return subscriptionService.hasActiveSubscription(memberId);
    }
    
    @PutMapping("/cancel/{memberId}")
    public void cancel(@PathVariable Long memberId) {
        subscriptionService.cancelSubscription(memberId);
    }

}
