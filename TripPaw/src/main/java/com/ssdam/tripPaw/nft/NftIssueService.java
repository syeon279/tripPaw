package com.ssdam.tripPaw.nft;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.MemberNft;
import com.ssdam.tripPaw.domain.NftMetadata;
import com.ssdam.tripPaw.member.MemberMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NftIssueService {

    // private final ReviewMapper reviewMapper;
	private final MemberMapper memberMapper;
    private final MemberNftService memberNftService;
    private final NftMetadataService nftMetadataService;

    @Transactional
    public void issueToMember(Long nftMetadataId, Long id, String issuedReason) {
        
        Member member = memberMapper.findById(id);
        if (member == null) {
            throw new IllegalArgumentException("해당 사용자를 찾을 수 없습니다: " + id);
        }

        // 메타데이터 조회
        NftMetadata metadata = nftMetadataService.findById(nftMetadataId);
        if (metadata == null) {
            throw new IllegalArgumentException("해당 NFT 메타데이터를 찾을 수 없습니다: " + nftMetadataId);
        }

        MemberNft memberNft = new MemberNft();
        memberNft.setNftMetadata(metadata);
        memberNft.setMember(member);
        memberNft.setIssuedAt(LocalDateTime.now());
        memberNft.setIssuedReason(issuedReason);
        memberNft.setTokenId(metadata.getTokenId());

        memberNftService.issueNft(memberNft);
    }
}
