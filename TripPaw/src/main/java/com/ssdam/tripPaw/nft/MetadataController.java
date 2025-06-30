package com.ssdam.tripPaw.nft;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import com.ssdam.tripPaw.domain.NftMetadata;

@RestController
@RequestMapping("/admin/metadata")
@RequiredArgsConstructor
public class MetadataController {

    private final NftMetadataService nftMetadataService;

    @GetMapping
    public List<NftMetadata> findAll() {
        return nftMetadataService.findAll();
    }

    @PostMapping
    public void create(@RequestBody NftMetadata nftMetadata) {
        nftMetadataService.create(nftMetadata);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable Long id, @RequestBody NftMetadata nftMetadata) {
        nftMetadata.setId(id);
        nftMetadataService.update(nftMetadata);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        nftMetadataService.delete(id);
    }
}
