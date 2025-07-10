package com.ssdam.tripPaw.subscription;

import com.ssdam.tripPaw.domain.Subscription;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionMapper subscriptionMapper;

    public void subscribe(Subscription subscription) {
        subscriptionMapper.insert(subscription);
    }

    public Subscription getLatestSubscription(Long memberId) {
        return subscriptionMapper.findLatestByMemberId(memberId);
    }

    public boolean hasActiveSubscription(Long memberId) {
        return subscriptionMapper.hasActiveSubscription(memberId);
    }
    
    public void cancelSubscription(Long memberId) {
        subscriptionMapper.cancelSubscription(memberId);
    }

}
