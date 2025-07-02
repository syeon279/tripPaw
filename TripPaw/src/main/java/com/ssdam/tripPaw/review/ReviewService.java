package com.ssdam.tripPaw.review;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.Reserv;
import com.ssdam.tripPaw.domain.Review;
import com.ssdam.tripPaw.domain.ReviewType;
import com.ssdam.tripPaw.domain.Route;
import com.ssdam.tripPaw.domain.TripPlan;
import com.ssdam.tripPaw.domain.TripPlanCourse;
import com.ssdam.tripPaw.place.PlaceMapper;
import com.ssdam.tripPaw.reserv.ReservMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {
	private final ReviewMapper reviewMapper;
	private final ReviewTypeMapper reviewTypeMapper;
	private final TripPlanMapper tripPlanMapper;
    private final ReservMapper reservMapper;
    private final WeatherService weatherService;
    
    private static final String KMA_API = "https://apis.data.go.kr/1360000/AsosHourlyInfoService/getWthrDataList";
	
    private static final ObjectMapper mapper = new ObjectMapper();
	private static final String GPT_URL = "https://api.openai.com/v1/chat/completions";
	private final String apiKey = "sk-..."; // GPT API 키
	
	private String mapWeatherCode(String code) {
	    switch (code) {
	        case "90": return "맑음 ☀️";
	        case "91": return "구름 조금 🌤️";
	        case "92": return "흐림 ☁️";
	        case "01": case "02": case "04": return "비 🌧️";
	        case "05": case "08": case "10": case "11": case "22": return "눈 ❄️";
	        case "06": case "09": return "진눈깨비 🌨️";
	        case "16": case "18": case "19": return "안개 🌫️";
	        case "42": return "황사 🌪️";
	        default: return "기타 현상 🌈";
	    }
	}
	
	public void saveReviewWithWeather(ReviewDto dto) {
	    // 1. 회원 객체 준비
	    Member member = new Member();
	    member.setId(dto.getMemberId());

	    // 2. 리뷰타입 조회
	    ReviewType reviewType = reviewTypeMapper.findById(dto.getReviewTypeId());
	    if (reviewType == null) throw new RuntimeException("리뷰 타입 없음");

	    Long targetId = dto.getTargetId();
	    LocalDate date;
	    double lat, lon;

	    if ("PLAN".equalsIgnoreCase(reviewType.getTargetType())) {
	        TripPlan tripPlan = tripPlanMapper.findByIdWithCourses(targetId);
	        if (tripPlan == null || tripPlan.getTripPlanCourses() == null || tripPlan.getTripPlanCourses().isEmpty()) {
	            throw new RuntimeException("트립플랜 정보 없음");
	        }

	        TripPlanCourse course = tripPlan.getTripPlanCourses().get(0);
	        if (course.getRoute() == null || course.getRoute().getRoutePlaces() == null ||
	            course.getRoute().getRoutePlaces().isEmpty()) {
	            throw new RuntimeException("경로 정보 없음");
	        }

	        Place place = course.getRoute().getRoutePlaces().get(0).getPlace();
	        if (place == null || isNullOrEmpty(place.getLatitude()) || isNullOrEmpty(place.getLongitude())) {
	            throw new RuntimeException("경로에 연결된 장소 정보 부족 (위도/경도)");
	        }

	        lat = parseCoordinate(place.getLatitude(), "위도");
	        lon = parseCoordinate(place.getLongitude(), "경도");
	        date = LocalDate.now();

	    } else if ("PLACE".equalsIgnoreCase(reviewType.getTargetType())) {
	        Reserv reserv = reservMapper.findByIdWithPlace(targetId);
	        if (reserv == null) throw new RuntimeException("예약 정보를 찾을 수 없습니다.");

	        Place place = reserv.getPlace();
	        if (place == null || isNullOrEmpty(place.getLatitude()) || isNullOrEmpty(place.getLongitude())) {
	            throw new RuntimeException("예약에 연결된 장소 정보 부족");
	        }

	        lat = parseCoordinate(place.getLatitude(), "위도");
	        lon = parseCoordinate(place.getLongitude(), "경도");
	        date = reserv.getStartDate();

	    } else {
	        throw new RuntimeException("알 수 없는 리뷰 타입입니다.");
	    }

	    String weather = weatherService.getWeather(date, lat, lon);

	    Review review = new Review();
	    review.setMember(member);
	    review.setReviewType(reviewType);
	    review.setTargetId(targetId);
	    review.setContent(dto.getContent());
	    review.setRating(dto.getRating());
	    review.setCreatedAt(LocalDateTime.now());
	    review.setWeatherCondition(weather);

	    reviewMapper.insertReview(review);
	}

	// 문자열이 null이거나 빈 문자열인지 확인
	private boolean isNullOrEmpty(String str) {
	    return str == null || str.trim().isEmpty();
	}

	// 위도/경도 문자열을 double로 변환
	private double parseCoordinate(String coordinate, String label) {
	    try {
	        return Double.parseDouble(coordinate.trim());
	    } catch (NumberFormatException e) {
	        throw new RuntimeException(label + " 값이 숫자가 아닙니다: " + coordinate, e);
	    }
	}
    public String findNearestStnId(Double lat, Double lng) {
        List<WeatherStation> stations = getStations(); // 고정된 관측소 목록 불러오기

        WeatherStation nearest = null;
        double minDistance = Double.MAX_VALUE;

        for (WeatherStation station : stations) {
            double distance = Math.pow(lat - station.getLat(), 2) + Math.pow(lng - station.getLng(), 2);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = station;
            }
        }

        return nearest != null ? nearest.getStnId() : null;
    }
    
    private List<WeatherStation> getStations() {
	    return List.of(
	        new WeatherStation("108", "서울", 37.5665, 126.9780),
	        new WeatherStation("119", "부산", 35.1796, 129.0756),
	        new WeatherStation("133", "대전", 36.3504, 127.3845),
	        new WeatherStation("105", "강릉", 37.7519, 128.8761)
	        // 필요한 만큼 추가
	    );
	}
    
    

}
