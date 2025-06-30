package com.ssdam.tripPaw.nft;

import java.time.LocalDateTime;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import com.ssdam.tripPaw.domain.UserNft;

@Mapper
public interface UserNftMapper {
    List<UserNft> findByUserId(String userId);
    void insert(UserNft userNft);
    void update(UserNft userNft);
    void markAsUsed(Long id, LocalDateTime usedAt);
}