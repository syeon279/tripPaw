package com.ssdam.tripPaw.favorite;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ssdam.tripPaw.domain.Favorite;
import com.ssdam.tripPaw.domain.Member;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    // 즐겨찾기 등록
    @PostMapping
    public ResponseEntity<String> addFavorite(@RequestBody Favorite favorite) {
        favoriteService.addFavorite(favorite);
        return ResponseEntity.ok("즐겨찾기에 추가되었습니다.");
    }

    // 즐겨찾기 삭제
    @DeleteMapping
    public ResponseEntity<String> removeFavorite(@RequestBody Favorite favorite) {
        favoriteService.removeFavorite(favorite);
        return ResponseEntity.ok("즐겨찾기에서 삭제되었습니다.");
    }

    // 단건 즐겨찾기 여부 확인
    @GetMapping("/check")
    public ResponseEntity<Favorite> checkFavorite(
            @RequestParam Long targetId,
            @RequestParam String targetType,
            @RequestParam Long memberId
    ) {
        Favorite favorite = new Favorite();
        favorite.setTargetId(targetId);
        favorite.setTargetType(targetType);
        Member member = new Member();
        member.setId(memberId);
        favorite.setMember(member);

        Favorite found = favoriteService.getFavorite(favorite);
        if (found != null) {
            return ResponseEntity.ok(found);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    // 특정 유저의 즐겨찾기 목록
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Favorite>> getFavorites(@PathVariable Long memberId) {
        List<Favorite> list = favoriteService.getFavoritesByMemberId(memberId);
        return ResponseEntity.ok(list);
    }
}
