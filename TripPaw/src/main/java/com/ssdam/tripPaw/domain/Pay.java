package com.ssdam.tripPaw.domain;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Pay {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(unique=true)
    private String impUid;         // 아임포트 결제 ID
	@Column(unique=true)
    private String merchantUid;    // 가맹점 주문번호

    private int amount;
    private String payMethod;

    @Column(name = "pg_provider")
    private String pgProvider;
    
    private String state;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserv_id", nullable = false)
    private Reserv reserv;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payGroup_id", nullable = false)
    private PayGroup payGroup;
}
