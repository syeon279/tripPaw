package com.ssdam.tripPaw.nft;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import com.ssdam.tripPaw.domain.NftMetadata;

@CrossOrigin(origins = "http://localhost:3000") // 👈 이 줄 추가
@RestController
@RequestMapping("/admin/metadata")
@RequiredArgsConstructor
public class NftMetadataController {

    private final NftMetadataService nftMetadataService;

    @GetMapping
    public List<NftMetadata> findAll() {
        return nftMetadataService.findAll();
    }

    @PostMapping
    public ResponseEntity<NftMetadata> create(@RequestBody NftMetadata nftMetadata) {
        nftMetadataService.create(nftMetadata);
        return ResponseEntity.ok(nftMetadata); // 새로 삽입된 데이터 응답
    }

    @PutMapping("/{id}")
    public ResponseEntity<NftMetadata> update(@PathVariable Long id, @RequestBody NftMetadata nftMetadata) {
        nftMetadata.setId(id);
        nftMetadataService.update(nftMetadata);
        NftMetadata updated = nftMetadataService.findById(id);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        nftMetadataService.delete(id);
    }
}
