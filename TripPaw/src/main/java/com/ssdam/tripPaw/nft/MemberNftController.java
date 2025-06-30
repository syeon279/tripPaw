package com.ssdam.tripPaw.nft;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ssdam.tripPaw.domain.MemberNft;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/member-nft")
@RequiredArgsConstructor
public class MemberNftController {

    private final MemberNftService memberNftService;

    // 특정 멤버의 NFT 조회
    @GetMapping("/{memberId}")
    public ResponseEntity<List<MemberNft>> getMemberNfts(@PathVariable String memberId) {
        return ResponseEntity.ok(memberNftService.getMemberNfts(memberId));
    }

    // NFT 발급
    @PostMapping
    public ResponseEntity<String> issueNft(@RequestBody MemberNft memberNft) {
        memberNftService.issueNft(memberNft);
        return ResponseEntity.ok("NFT issued successfully");
    }

    // NFT 수정
    @PutMapping("/{id}")
    public ResponseEntity<String> updateNft(@PathVariable Long id, @RequestBody MemberNft memberNft) {
        memberNft.setId(id);
        memberNftService.updateNft(memberNft);
        return ResponseEntity.ok("NFT updated");
    }

    // NFT 사용 처리
    @PostMapping("/use/{id}")
    public ResponseEntity<String> useNft(@PathVariable Long id) {
        memberNftService.markAsUsed(id);
        return ResponseEntity.ok("NFT marked as used");
    }
}
