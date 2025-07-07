package com.ssdam.tripPaw.favorite;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssdam.tripPaw.domain.Favorite;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class FavoriteService {

    private final FavoriteMapper favoriteMapper;

    // 즐겨찾기 등록
    public void addFavorite(Favorite favorite) {
        favoriteMapper.insertFavorite(favorite);
    }

    // 즐겨찾기 삭제
    public void removeFavorite(Favorite favorite) {
        favoriteMapper.deleteFavorite(favorite);
    }

    // 즐겨찾기 단건 조회
    @Transactional(readOnly = true)
    public Favorite getFavorite(Favorite favorite) {
        return favoriteMapper.selectFavorite(favorite);
    }

    // 특정 유저의 즐겨찾기 목록
    @Transactional(readOnly = true)
    public List<Favorite> getFavoritesByMemberId(Long memberId) {
        return favoriteMapper.selectFavoritesByMemberId(memberId);
    }
}
