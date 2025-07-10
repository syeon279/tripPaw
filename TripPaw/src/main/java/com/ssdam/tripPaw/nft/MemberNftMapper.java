package com.ssdam.tripPaw.nft;

import java.time.LocalDateTime;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import com.ssdam.tripPaw.domain.MemberNft;

@Mapper
public interface MemberNftMapper {
    List<MemberNft> findByMemberId(Long memberId);
    void insert(MemberNft memberNft);
    void update(MemberNft memberNft);
    void markAsUsed(Long id, LocalDateTime usedAt);
    void deleteByIdAndMemberId(Long id, String memberId);
    void giftNft(Long nftId, String fromMemberId, String toMemberId);
    boolean existsByNftMetadataId(Long metadataId);
}
