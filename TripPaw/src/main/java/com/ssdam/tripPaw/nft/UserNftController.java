package com.ssdam.tripPaw.nft;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ssdam.tripPaw.domain.UserNft;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user-nft")
@RequiredArgsConstructor
public class UserNftController {

    private final UserNftService userNftService;

    // 특정 사용자 NFT 조회
    @GetMapping("/{userId}")
    public ResponseEntity<List<UserNft>> getUserNfts(@PathVariable String userId) {
        return ResponseEntity.ok(userNftService.getUserNfts(userId));
    }

    // NFT 발급
    @PostMapping
    public ResponseEntity<String> issueNft(@RequestBody UserNft userNft) {
        userNftService.issueNft(userNft);
        return ResponseEntity.ok("NFT issued successfully");
    }

    // NFT 수정
    @PutMapping("/{id}")
    public ResponseEntity<String> updateNft(@PathVariable Long id, @RequestBody UserNft userNft) {
        userNft.setId(id);
        userNftService.updateNft(userNft);
        return ResponseEntity.ok("NFT updated");
    }

    // NFT 사용 처리
    @PostMapping("/use/{id}")
    public ResponseEntity<String> useNft(@PathVariable Long id) {
        userNftService.markAsUsed(id);
        return ResponseEntity.ok("NFT marked as used");
    }
}
