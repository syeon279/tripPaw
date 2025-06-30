package com.ssdam.tripPaw.nft;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import com.ssdam.tripPaw.domain.NftMetadata;

@Mapper
public interface NftMetadataMapper {
    List<NftMetadata> findAll();
    NftMetadata findById(Long id);
    void insert(NftMetadata nftMetadata);
    void update(NftMetadata nftMetadata);
    void delete(Long id);
}