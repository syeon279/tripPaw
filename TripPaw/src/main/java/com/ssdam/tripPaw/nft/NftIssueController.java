package com.ssdam.tripPaw.nft;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/nft")
@RequiredArgsConstructor
public class NftIssueController {

    private final NftIssueService nftIssueService;

    /**
     * 특정 유저에게 NFT 발급
     * @param nftMetadataId NFT 메타데이터 ID
     * @param memberId 유저 이메일(ID)
     * @param issuedReason 발급 이유
     */
    @PostMapping("/issue-to-member")
    public ResponseEntity<String> issueToSpecificMember(
        @RequestParam Long nftMetadataId,
        @RequestParam Long id,
        @RequestParam String issuedReason) {
      try {
        nftIssueService.issueToMember(nftMetadataId, id, issuedReason);
        return ResponseEntity.ok("NFT 발급 성공");
      } catch (Exception e) {
        return ResponseEntity.status(500).body("NFT 발급 실패: " + e.getMessage());
      }
    }
}
