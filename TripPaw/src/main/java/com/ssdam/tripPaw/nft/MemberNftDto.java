package com.ssdam.tripPaw.nft;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class MemberNftDto {
    private Long id;
    private Long nftMetadataId;
    private String tokenId;
    private String memberId;
    private String walletAddress;
    private LocalDateTime issuedAt;
    private String barcode;
    private LocalDateTime dueAt;
    private String issuedReason;
    private String txHash;
}