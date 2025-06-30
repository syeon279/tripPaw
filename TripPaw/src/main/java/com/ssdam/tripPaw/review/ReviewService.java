package com.ssdam.tripPaw.review;

import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.Review;
import com.ssdam.tripPaw.domain.ReviewType;
import com.ssdam.tripPaw.place.PlaceMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {
	private final ReviewMapper reviewMapper;
	private final ReviewTypeMapper reviewTypeMapper;
    private final PlaceMapper placeMapper;
	
//	@Value("${openai.api.key}")
//	private String apiKey;
    
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
	
	// ✅ 리뷰 저장
	@Transactional
	public void saveReview(Map<String, Object> request, String weather) {
	    Review review = new Review();
	    review.setContent((String) request.get("content"));
	    review.setWeatherCondition(weather);
	    review.setCreatedAt(LocalDateTime.now());

	    // ReviewType 설정
	    String typeString = (String) request.get("type");	// place / plan
	    Long targetId = Long.parseLong(request.get("targetId").toString());

        ReviewType reviewType = reviewTypeMapper.findByTargetType(typeString);
        if (reviewType == null) throw new RuntimeException("리뷰 타입 없음");
        
        review.setReviewType(reviewType);
        review.setTargetId(targetId);

        reviewMapper.insertReview(review);
	}
	
	// ✅ GPT 리뷰 자동 생성
	public String generateAIReview(List<String> keywords) {
		try {
            String prompt = "다음 키워드를 포함하여 여행 리뷰를 2~3문장으로 자연스럽게 작성해줘: " + String.join(", ", keywords);
            Map<String, Object> message = Map.of( "role", "user", "content", prompt );
            Map<String, Object> requestBody = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", List.of(message),
                "temperature", 0.7
            );
            String bodyJson = mapper.writeValueAsString(requestBody);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(GPT_URL))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(bodyJson))
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            Map<String, Object> result = mapper.readValue(response.body(), Map.class);
            List<Map<String, Object>> choices = (List<Map<String, Object>>) result.get("choices");
            Map<String, Object> messageResult = (Map<String, Object>) choices.get(0).get("message");
            return (String) messageResult.get("content");

        } catch (Exception e) {
            e.printStackTrace();
            return "AI 리뷰 생성에 실패했어요.";
        }
    }
	
	// ✅ 날씨 조회 - 장소 기반
    public String getWeatherByPlaceId(Long placeId, String date) {
        Place place = placeMapper.findById(placeId);
        if (place == null) throw new RuntimeException("장소 정보 없음");
        String stnId = findNearestStnId( 
        	Double.parseDouble(place.getLatitude()), 
        	Double.parseDouble(place.getLongitude())
        );
        LocalDateTime dateTime = LocalDateTime.parse(date + "T00:00:00"); // 예: "2025-06-01"
        
        return fetchWeatherFromKmaApi(stnId, dateTime);
    }

    // ✅ 날씨 조회 - 여행경로 기반
    public String getWeatherByPlanId(Long planId, String date, String hour) {
        String dateTimeStr = date + "T" + hour + ":00"; // 예: 2025-06-01T13:00
        LocalDateTime dateTime = LocalDateTime.parse(dateTimeStr);

        String region = getFirstRegionOfPlan(planId); 
        String stnId = regionToStnId(region);
        return fetchWeatherFromKmaApi(stnId, dateTime);
    }

    public String regionToStnId(String regionName) {
        // 예: "서울" → "108"
        return "108";
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
    
    public String fetchWeatherFromKmaApi(String stnId, LocalDateTime dateTime) {
    	try {
            String serviceKey = URLEncoder.encode("발급받은 인증키", StandardCharsets.UTF_8); // 실제 인증키 사용
            String date = dateTime.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String hour = String.format("%02d", dateTime.getHour());

            String url = String.format("%s?serviceKey=%s&pageNo=1&numOfRows=1&dataType=JSON&dataCd=ASOS&dateCd=HR&startDt=%s&startHh=%s&endDt=%s&endHh=%s&stnIds=%s",
                    KMA_API, serviceKey, date, hour, date, hour, stnId);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();

            HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
            JsonNode root = mapper.readTree(response.body());
            JsonNode items = root.path("response").path("body").path("items").path("item");

            if (items.isArray() && items.size() > 0) {
                String code = items.get(0).path("dmstMtphNo").asText();
                return mapWeatherCode(code); // 현상 코드 → 텍스트 변환
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "날씨 정보 없음";
    }

    public String getFirstRegionOfPlan(Long planId) {
        // Plan + PlanDetail에서 첫 날 지역명 가져오기
        return "서울";
    }
	
    // ✅ 특정 대상의 리뷰 목록 조회
    public List<Review> getReviews(String type, Long targetId) {
        ReviewType reviewType = reviewTypeMapper.findByTargetType(type);
        return reviewMapper.findByTarget(targetId, reviewType.getId());
    }
	@Transactional
	public void updateReview(Review review) {
		reviewMapper.updateReview(review);
	}
	
	@Transactional
	public void deleteReview(Review review) {
		reviewMapper.deleteReview(review);
	}
	
	public Review getReview(Long id) {
		return reviewMapper.findById(id);
	}
	
	public List<Review> getMemberReviews(Long memberId) {
        return reviewMapper.findByMemberId(memberId);
    }

    private void grantBadgeIfNeeded(Member member) {
        int totalContentLength = member.getReviews().stream()
            .mapToInt(r -> r.getContent().length())
            .sum();
    }
	
}
