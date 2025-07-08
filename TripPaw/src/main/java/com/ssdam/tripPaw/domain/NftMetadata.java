package com.ssdam.tripPaw.domain;

import java.time.LocalDateTime;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "nft_metadata")
@Data
public class NftMetadata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "token_id", nullable = false, unique = true)
    private Long tokenId; // 🆕 NFT 고유 Token ID (블록체인 ID)

    @Column(nullable = false, length = 100)
    private String title; // 예: "강아지 간식 NFT"

    @Column(name = "image_url", length = 255)
    private String imageUrl; // IPFS 주소

    @Column(name = "point_value", nullable = false)
    private Integer pointValue; // 교환 시 지급할 포인트

    @Column(name = "issued_at")
    private LocalDateTime issuedAt;

    @PrePersist
    public void onCreate() {
        this.issuedAt = LocalDateTime.now();
    }

    @OneToMany(mappedBy = "nftMetadata", cascade = CascadeType.ALL)
    private List<MemberNft> memberNfts;
}