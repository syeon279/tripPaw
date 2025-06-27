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
import javax.persistence.PrePersist;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "user_nft")
@Data
public class UserNft {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 외래키 - NftMetadata (다대일)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nft_metadata_id", nullable = false)
    private NftMetadata nftMetadata;

    
    //  외래키 - Member (다대일)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
    

    @Column(name = "token_id", nullable = false, unique = true)
    private String tokenId;

    @Column(name = "issued_at")
    private LocalDateTime issuedAt;

    @Column(name = "used_at")
    private LocalDateTime usedAt;

    @Column(name = "is_used", nullable = false)
    private boolean isUsed = false;

    @Column(name = "wallet_address")
    private String walletAddress;

    @Column(name = "barcode")
    private String barcode;

    @Column(name = "due_at")
    private LocalDateTime dueAt;

    @Column(name = "issued_reason")
    private String issuedReason;

    @Column(name = "tx_hash")
    private String txHash;

    @PrePersist
    public void onCreate() {
        this.issuedAt = LocalDateTime.now();
    }
}