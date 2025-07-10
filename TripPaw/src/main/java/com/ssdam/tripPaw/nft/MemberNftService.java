package com.ssdam.tripPaw.nft;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.MemberNft;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberNftService {

    private final MemberNftMapper memberNftMapper;

    // 특정 멤버의 NFT 조회
    public List<MemberNft> getMemberNfts(Long memberId) {
        return memberNftMapper.findByMemberId(memberId);
    }

    // NFT 발급
    public void issueNft(MemberNft memberNft) {
        memberNftMapper.insert(memberNft);
    }

    // NFT 수정
    public void updateNft(MemberNft memberNft) {
        memberNftMapper.update(memberNft);
    }

    // NFT 사용 처리
    public void markAsUsed(Long id) {
        memberNftMapper.markAsUsed(id, LocalDateTime.now());
    }
    
    // 유저 NFT 삭제
    public void deleteMemberNft(Long id, String memberId) {
        memberNftMapper.deleteByIdAndMemberId(id, memberId);
    }
    
    // NFT 선물 기능
    public void giftNft(Long nftId, String fromMemberId, String toMemberId) {
        // 선물하기: 기존 소유자가 toMemberId로 변경
        memberNftMapper.giftNft(nftId, fromMemberId, toMemberId);
    }
}
