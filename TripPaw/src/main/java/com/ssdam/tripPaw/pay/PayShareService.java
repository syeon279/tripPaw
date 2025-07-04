package com.ssdam.tripPaw.pay;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.PayShare;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PayShareService {
	
	private final PayShareMapper payShareMapper;
	
    public List<PayShare> findAll() {
        return payShareMapper.findAll();
    }
    
    public PayShare findById(Long payId) {
        return payShareMapper.findById(payId);
    }

    public void insert(PayShare payShare) {
        payShare.setCreatedAt(LocalDateTime.now());
        payShareMapper.insert(payShare);
    }
    
    public void delete(Long id) {
        payShareMapper.delete(id);
    }
}
