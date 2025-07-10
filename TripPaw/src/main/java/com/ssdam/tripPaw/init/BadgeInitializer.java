//package com.ssdam.tripPaw.init;
//
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//import com.ssdam.tripPaw.badge.BadgeMapper;
//import com.ssdam.tripPaw.domain.Badge;
//
//import lombok.RequiredArgsConstructor;
//
//@Component
//@RequiredArgsConstructor
//public class BadgeInitializer implements CommandLineRunner {
//	private final BadgeMapper badgeMapper;
//	
//	@Override
//    public void run(String... args) {
//        int count = badgeMapper.countBadges();
//        if (count > 0) {
//            System.out.println("[INFO] Badge 테이블에 이미 " + count + "개의 데이터가 있어 더미 삽입을 건너뜁니다.");
//            return;
//        }
//
//        insertBadge("개미", "시작하는 리뷰어", "/upload/badges/badge1.png", 1);
//        insertBadge("고슴도치", "작은 무게 큰 성실함", "/upload/badges/badge2.png", 2);
//        insertBadge("토끼", "점점 빠른 발걸음", "/upload/badges/badge3.png", 3);
//        insertBadge("고양이", "날렵한 리뷰어", "/upload/badges/badge4.png", 4);
//        insertBadge("강아지", "귀여운 리뷰 달성자", "/upload/badges/badge5.png", 5);
//        insertBadge("여우", "리뷰 센스 장착", "/upload/badges/badge6.png", 6);
//        insertBadge("캥거루", "성큼성큼 성장", "/upload/badges/badge7.png", 7);
//        insertBadge("수달", "물 흐르듯 작성하는 리뷰어", "/upload/badges/badge8.png", 8);
//        insertBadge("사자", "왕 같은 리뷰어", "/upload/badges/badge9.png", 9);
//        insertBadge("코끼리", "궁극의 리뷰 마스터", "/upload/badges/badge10.png", 10);
//    }
//	private void insertBadge(String name, String description, String imageUrl, int weight) {
//        Badge badge = new Badge();
//        badge.setName(name);
//        badge.setDescription(description);
//        badge.setImageUrl(imageUrl);
//        badge.setWeight(weight);
//        badgeMapper.insertBadge(badge);
//    }
//}
