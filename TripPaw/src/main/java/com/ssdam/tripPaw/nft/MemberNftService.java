package com.ssdam.tripPaw.nft;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.MemberNft;
import com.ssdam.tripPaw.member.MemberMapper;
import com.ssdam.tripPaw.member.MemberService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberNftService {

    private final MemberNftMapper memberNftMapper;
    private final MemberService memberService;
    private final MemberMapper memberMapper;

    // 특정 멤버의 NFT 조회
    public List<MemberNft> getMemberNfts(Long memberId) {
        return memberNftMapper.findByMemberId(memberId)
            .stream()
            .filter(nft -> nft.getUsedAt() == null) 
            .collect(Collectors.toList());
    }

    // NFT 발급
    public void issueNft(MemberNft memberNft) {
        // 바코드가 없으면 생성
        if (memberNft.getBarcode() == null || memberNft.getBarcode().isEmpty()) {
            String barcode = generateBarcode();  // 바코드 생성 메서드
            memberNft.setBarcode(barcode);
        }
        LocalDateTime now = LocalDateTime.now();
        memberNft.setIssuedAt(now);
        memberNft.setDueAt(now.plusMonths(1));  // 만료기간 1개월 예시
        memberNftMapper.insert(memberNft);
    }

    private String generateBarcode() {
        // UUID를 활용한 간단한 12자리 바코드 생성 (필요 시 변경 가능)
        return UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }

    // NFT 수정
    public void updateNft(MemberNft memberNft) {
        memberNftMapper.update(memberNft);
    }

    // NFT 사용 처리 + 포인트 적립
    public void markAsUsed(Long id) {
        LocalDateTime now = LocalDateTime.now();
        memberNftMapper.markAsUsed(id, now); // DB에 usedAt 업데이트

        MemberNft nft = memberNftMapper.findById(id);
        if (nft != null && nft.getNftMetadata() != null && nft.getMember() != null) {
            int points = nft.getNftMetadata().getPointValue();
            Long memberId = nft.getMember().getId();

            // 기존 updatePoints → insert 방식 addPoints로 변경
            memberService.addPoints(memberId, points);
        }
    }

    // 유저 NFT 삭제
    public void deleteMemberNft(Long id, String memberId) {
        memberNftMapper.deleteByIdAndMemberId(id, memberId);
    }
    
    // 관리자용: 사용 완료된 NFT만 삭제
    public void deleteUsedByNftMetadataId(Long nftMetadataId) {
        memberNftMapper.deleteUsedByNftMetadataId(nftMetadataId);
    }

    // NFT 선물 기능
    public void giftNftByNickname(Long nftId, Long fromMemberId, String toNickname) {
        MemberNft nft = memberNftMapper.findById(nftId);
        if (nft == null) {
            throw new IllegalArgumentException("해당 NFT가 존재하지 않습니다.");
        }
        if (!nft.getMember().getId().equals(fromMemberId)) {
            throw new IllegalArgumentException("NFT 소유자가 아닙니다.");
        }
        if (nft.getUsedAt() != null) {
            throw new IllegalArgumentException("이미 사용된 NFT는 선물할 수 없습니다.");
        }

        // 닉네임으로 받는 사람 ID 조회
        Member toMember = memberMapper.findByNickname(toNickname);
        if (toMember == null) {
            throw new IllegalArgumentException("선물받을 사용자가 존재하지 않습니다.");
        }
        
        // 🔒 본인에게 선물 방지
        if (toMember.getId().equals(fromMemberId)) {
            throw new IllegalArgumentException("본인에게는 NFT를 선물할 수 없습니다.");
        }

        memberNftMapper.giftNft(nftId, fromMemberId, toMember.getId());
    }
}
