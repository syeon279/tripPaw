// SubscriptionMapper.java
package com.ssdam.tripPaw.subscription;

import com.ssdam.tripPaw.domain.Subscription;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface SubscriptionMapper {
    void insert(Subscription subscription);

    Subscription findLatestByMemberId(@Param("memberId") Long memberId);

    boolean hasActiveSubscription(@Param("memberId") Long memberId);
    
    void cancelSubscription(Long memberId);

}