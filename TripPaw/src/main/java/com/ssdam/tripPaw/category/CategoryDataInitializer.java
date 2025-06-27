package com.ssdam.tripPaw.category;

import com.ssdam.tripPaw.domain.Category;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CategoryDataInitializer implements ApplicationRunner {

    private final CategoryMapper categoryMapper;

    public CategoryDataInitializer(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    @Override
    public void run(ApplicationArguments args) {
    	System.out.println("📢 CategoryDataInitializer 실행됨");
    	
    	List<String> categoryNames = List.of(
    		    // 📍 여행 분위기/감성
    		    "한적한", "힐링", "감성 인스타", "로맨틱", "레트로", "빈티지 감성",
    		    "오션뷰", "숲속 감성", "새소리 들리는", "노을 맛집", "자연광 가득", "계절별 인생샷 명소",

    		    // 🧭 여행 형태/일정
    		    "당일치기", "1박 2일", "2박 3일", "3박 4일", "장기여행", "무계획 여행",
    		    "혼행 (혼자 여행)", "커플 여행", "가족 여행", "시니어 여행", "아동/유아 동반",

    		    // 🏕️ 여행 방식/숙박
    		    "캠핑", "차박", "도보 여행", "애견동반 글램핑", "자차 여행", "뚜벅이 여행",

    		    // 💡 여행 목적/성향
    		    "모험/도전", "역사 탐방", "문화예술 체험", "이색 체험", "출사 여행", "브이로그 촬영지",
    		    "휴양 중심", "체험 위주", "쇼핑 중심", "시장/전통거리", "노포 맛집 탐방", "로컬 라이프 체험",
    		    "번아웃 회복", "워케이션", "스몰 럭셔리", "고급/럭셔리 여행", "혼잡도 낮은 장소",

    		    // 🐾 반려동물 특화
    		    "반려동물 동반", "반려견 동반 가능 카페", "반려동물 전용 해변", "반려동물 온천",
    		    "펫프렌들리 레스토랑", "동물병원 인근", "반려동물 포토존", "반려동물 카페 동반",
    		    "반려동물 실내 가능", "반려동물 노키즈존", "반려동물 자연 체험", "반려동물 놀이터 인근",
    		    "반려동물 입장료 무료", "반려동물 탈것 탑승 가능", "반려동물 안전한 산책로",
    		    "반려동물 박람회 장소",

    		    // 🍽️ 음식/먹거리
    		    "먹방 여행",

    		    // 🧗 액티비티
    		    "트레킹/등산", "서핑/수상 스포츠",

    		    // 🕒 계절/시간/날씨
    		    "날씨 좋은 날 추천", "비 오는 날 추천", "겨울철 한정", "여름철 한정", "사계절 내내 좋은",
    		    "야간 개장 장소", "명상/요가 가능한 장소",

    		    // 🎥 콘텐츠/미디어
    		    "영화/드라마 촬영지", "사진 찍기 좋은", "SNS 핫플",

    		    // 🏙️ 장소 유형/지역
    		    "해변/바다", "산/계곡", "도시/야경", "전망대", "수목원", "섬 여행지",
    		    "해안 산책로", "마을 골목"
    		);


        for (String name : categoryNames) {
            if (categoryMapper.findByName(name) == null ) {
                Category category = new Category();
                category.setName(name);
                categoryMapper.insert(category);
            }
        }
    }
}
