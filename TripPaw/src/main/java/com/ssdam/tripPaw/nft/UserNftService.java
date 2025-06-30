package com.ssdam.tripPaw.nft;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import com.ssdam.tripPaw.domain.UserNft;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserNftService {

    private final UserNftMapper userNftMapper;

    // 사용자별 NFT 조회
    public List<UserNft> getUserNfts(String userId) {
        return userNftMapper.findByUserId(userId);
    }

    // NFT 발급
    public void issueNft(UserNft userNft) {
        userNftMapper.insert(userNft);
    }

    // NFT 수정
    public void updateNft(UserNft userNft) {
        userNftMapper.update(userNft);
    }

    // NFT 사용 처리
    public void markAsUsed(Long id) {
        userNftMapper.markAsUsed(id, LocalDateTime.now());
    }
}
