package com.ssdam.tripPaw.nft;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/nft")
@RequiredArgsConstructor
public class NFTController {

    private final NFTService nftService;

    @GetMapping("/tokens")
    public ResponseEntity<?> getNFTs(
            @RequestParam String contractAddress,
            @RequestParam String walletAddress) {
        try {
            return ResponseEntity.ok(nftService.getNFTs(contractAddress, walletAddress));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("오류: " + e.getMessage());
        }
    }
}
