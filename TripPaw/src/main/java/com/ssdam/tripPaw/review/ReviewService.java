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
import com.ssdam.tripPaw.domain.Badge;
import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.Reserv;
import com.ssdam.tripPaw.domain.Review;
import com.ssdam.tripPaw.domain.ReviewImage;
import com.ssdam.tripPaw.domain.ReviewType;
import com.ssdam.tripPaw.domain.Route;
import com.ssdam.tripPaw.domain.TripPlan;
import com.ssdam.tripPaw.domain.TripPlanCourse;
import com.ssdam.tripPaw.member.MemberMapper;
import com.ssdam.tripPaw.member.MemberService;
import com.ssdam.tripPaw.place.PlaceMapper;
import com.ssdam.tripPaw.reserv.ReservMapper;
import com.ssdam.tripPaw.tripPlan.TripPlanMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {
	private final ReviewMapper reviewMapper;
	private final ReviewTypeMapper reviewTypeMapper;
	private final TripPlanMapper tripPlanMapper;
    private final ReservMapper reservMapper;
    private final WeatherService weatherService;
    private final FileUploadService fileUploadService;
    private final ReviewImageMapper reviewImageMapper;
    private final MemberBadgeMapper badgeMapper;
    private final MemberService memberService;
    private final MemberMapper memberMapper;
    private final ReservForReviewMapper reservForReviewMapper;
    
    private static final ObjectMapper mapper = new ObjectMapper();
	private static final String GPT_URL = "https://api.openai.com/v1/chat/completions";

	private final String apiKey = "sk-...";
	
	public List<Reserv> getReservListForTripPlanReview(Long tripPlanId, Long memberId) {
        return reservForReviewMapper.findByTripPlanIdAndMember(tripPlanId, memberId);
    }

	public void saveReviewWithWeather(ReviewDto dto, List<MultipartFile> images) {
	    // 1. 회원 객체 준비
	    Member member = memberMapper.findById(dto.getMemberId());
	    if (member == null) throw new RuntimeException("회원 정보를 찾을 수 없습니다.");
	    //member.setId(dto.getMemberId());

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
	        
	        Reserv reserv = reservMapper.findByTripPlanId(targetId);
	        if (reserv == null) throw new RuntimeException("트립플랜에 연결된 예약 없음");
	        date = reserv.getStartDate(); 

	    } else if ("PLACE".equalsIgnoreCase(reviewType.getTargetType())) {
	        Reserv reserv = reservMapper.findByIdWithPlace(targetId);
	        if (reserv == null) throw new RuntimeException("예약 정보를 찾을 수 없습니다.");

	        System.out.println("[DEBUG] 예약 start_date: " + reserv.getStartDate());

	        // 1. 경로 기반 장소 리뷰인지 확인
	        if (reserv.getMemberTripPlan().getTripPlan() != null) {
	            System.out.println("[DEBUG] 경로 기반 장소 리뷰입니다.");
	            // 필요시 추가 로직 삽입 가능
	        } else {
	            System.out.println("[DEBUG] 단독 장소 예약 리뷰입니다.");
	        }

	        // 2. 장소 정보 확인
	        Place place = reserv.getPlace();
	        if (place == null || isNullOrEmpty(place.getLatitude()) || isNullOrEmpty(place.getLongitude())) {
	            throw new RuntimeException("예약에 연결된 장소 정보 부족");
	        }
	        
	        int count = reservForReviewMapper.countByMemberAndPlace(member.getId(), place.getId());
	        if (count == 0) {
	            throw new RuntimeException("해당 장소에 대한 예약 이력이 없어 리뷰를 작성할 수 없습니다.");
	        }

	        // 3. 좌표 및 날짜 추출
	        lat = parseCoordinate(place.getLatitude(), "위도");
	        lon = parseCoordinate(place.getLongitude(), "경도");
	        date = reserv.getStartDate();

	        // 4. 리뷰 저장 시 장소 ID로 저장
	        targetId = place.getId();
	    } else {
	        throw new RuntimeException("알 수 없는 리뷰 타입입니다.");
	    }

	    String weather = weatherService.getWeather(date, lat, lon);

	    // 5. Review 객체 생성 및 저장
	    Review review = new Review();
	    review.setMember(member);
	    review.setReviewType(reviewType);
	    review.setTargetId(targetId);
	    review.setContent(dto.getContent());
	    review.setRating(dto.getRating());
	    review.setCreatedAt(LocalDateTime.now());
	    review.setWeatherCondition(weather);

	    reviewMapper.insertReview(review);
	    
	    // 6. 이미지 업로드
	    if (images != null && !images.isEmpty()) {
	        for (MultipartFile file : images) {
	            String imageUrl = fileUploadService.upload(file); // 파일 저장 (로컬 or S3)

	            ReviewImage reviewImage = new ReviewImage();
	            reviewImage.setReview(review);
	            reviewImage.setImageUrl(imageUrl);
	            reviewImage.setOriginalFileName(file.getOriginalFilename());
	            reviewImage.setUploadedAt(LocalDateTime.now());

	            reviewImageMapper.insertReviewImage(reviewImage);
	        }
	    }
	    // 7. 뱃지 부여
	    this.evaluateAndGrantBadges(member.getId());
	}
	
	public boolean existsReservationForMemberAndPlace(Long memberId, Long placeId) {
	    return reservForReviewMapper.countByMemberAndPlace(memberId, placeId) > 0;
	}


	public String getWeatherCondition(String type, Long targetId) {
	    LocalDate date;
	    double lat, lon;

	    if ("PLAN".equalsIgnoreCase(type)) {
	        TripPlan tripPlan = tripPlanMapper.findByIdWithCourses(targetId);
	        if (tripPlan == null || tripPlan.getTripPlanCourses().isEmpty()) {
	            throw new RuntimeException("트립플랜 정보 없음");
	        }

	        TripPlanCourse course = tripPlan.getTripPlanCourses().get(0);
	        Place place = course.getRoute().getRoutePlaces().get(0).getPlace();

	        Reserv reserv = reservMapper.findByTripPlanId(targetId);
	        if (reserv == null) throw new RuntimeException("예약 정보 없음");

	        date = reserv.getStartDate();
	        lat = parseCoordinate(place.getLatitude(), "위도");
	        lon = parseCoordinate(place.getLongitude(), "경도");

	    } else if ("PLACE".equalsIgnoreCase(type)) {
	        Reserv reserv = reservMapper.findByIdWithPlace(targetId);
	        if (reserv == null) throw new RuntimeException("예약 정보 없음");

	        Place place = reserv.getPlace();
	        date = reserv.getStartDate();
	        lat = parseCoordinate(place.getLatitude(), "위도");
	        lon = parseCoordinate(place.getLongitude(), "경도");

	    } else {
	        throw new RuntimeException("알 수 없는 타입");
	    }

	    return weatherService.getWeather(date, lat, lon);
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
    
    
    public Review getReview(Long id) {
		return reviewMapper.findById(id);
	}
    public List<Review> getMemberReviews(Long memberId) {
        return reviewMapper.findByMemberId(memberId);
    }
    public List<MyReviewDto> getMyReviews(Long memberId) {
        return reviewMapper.findMyReviewsByMemberId(memberId);
    }

//    public List<Review> getReviewsByPlaceId(Long placeId) {
//        return reviewMapper.findByPlaceIdWithPlaceName(placeId);
//    }
    public List<Review> getReviewsByPlaceId(Long placeId) {
        return reviewMapper.findByPlaceId(placeId); // reviewResultMap 사용
    }


    public List<Review> getReviewsByPlanId(Long planId) {
        return reviewMapper.findByPlanId(planId);
    }

    public List<Review> getAllPlanReviews() {
        return reviewMapper.findAllPlanReviews();
    }
//    public List<ReviewPlanDto> getLatestPlanReviews() {
//        return reviewMapper.findAllPlanReviewsOrdered();
//    }
    public List<ReviewPlanDto> getPlanReviewsOrdered(String sort) {
        switch (sort) {
            case "high":
                return reviewMapper.findAllPlanReviewsOrderByRatingDesc();
            case "low":
                return reviewMapper.findAllPlanReviewsOrderByRatingAsc();
            case "recommended":
                return reviewMapper.findAllPlanReviewsOrderByLikesDesc();
            default:
                return reviewMapper.findAllPlanReviewsOrderByCreatedAtDesc();
        }
    }

    //리뷰수정
    @Transactional
    public void updateReview(Review review, List<MultipartFile> images) {
        reviewMapper.updateReview(review);

        if (images != null && !images.isEmpty()) {
            // 기존 이미지 삭제
            List<String> imageUrls = reviewImageMapper.findImageUrlsByReviewId(review.getId());
            for (String url : imageUrls) {
                fileUploadService.delete(url);
            }
            reviewImageMapper.deleteImagesByReviewId(review.getId());

            // 새 이미지 업로드
            for (MultipartFile file : images) {
                String imageUrl = fileUploadService.upload(file);

                ReviewImage reviewImage = new ReviewImage();
                reviewImage.setReview(review);
                reviewImage.setImageUrl(imageUrl);
                reviewImage.setOriginalFileName(file.getOriginalFilename());
                reviewImage.setUploadedAt(LocalDateTime.now());

                reviewImageMapper.insertReviewImage(reviewImage);
            }
        }
    }

    
    //리뷰삭제
    @Transactional
	public void deleteReview(Review review) {
    	Long reviewId = review.getId();

        // 1. 좋아요 삭제
        reviewMapper.deleteLikesByReviewId(reviewId);

        // 2. 이미지 URL 삭제
		List<String> imageUrls = reviewImageMapper.findImageUrlsByReviewId(review.getId());
	    for (String url : imageUrls) {
	        fileUploadService.delete(url); // S3�뿉�꽌 �궘�젣
	    }
	    
	    // 3. 이미지 DB 삭제
	    reviewImageMapper.deleteImagesByReviewId(review.getId());
	    // 4. 리뷰 삭제
		reviewMapper.deleteReview(review);
	}
    
    // openai
 	public String generateAIReview(List<String> keywords) {
 		try {
             String prompt = "다음 키워드를 포함해 여행 후기를 2~3문장으로 자연스럽게 작성해줘: " + String.join(", ", keywords);
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
             
             System.out.println("GPT 응답 코드: " + response.statusCode());
             System.out.println("GPT 응답 본문: " + response.body());
             
             if (response.statusCode() != 200) {
                 return "OpenAI 응답 오류: " + response.statusCode();
             }
             
             Map<String, Object> result = mapper.readValue(response.body(), Map.class);
             List<Map<String, Object>> choices = (List<Map<String, Object>>) result.get("choices");
             Map<String, Object> messageResult = (Map<String, Object>) choices.get(0).get("message");
             return (String) messageResult.get("content");

         } catch (Exception e) {
             e.printStackTrace();
             return "AI 리뷰 생성에 실패했습니다.";
         }
     }

 	public void likeReview(Long memberId, Long reviewId) {
 	    if (!reviewMapper.hasLikedReview(memberId, reviewId)) {
 	        reviewMapper.likeReview(memberId, reviewId);
 	    }
 	}

 	public void unlikeReview(Long memberId, Long reviewId) {
 	    reviewMapper.unlikeReview(memberId, reviewId);
 	}

 	public int getLikeCount(Long reviewId) {
 	    return reviewMapper.countLikes(reviewId);
 	}

 	public boolean hasLikedReview(Long memberId, Long reviewId) {
 	    return reviewMapper.hasLikedReview(memberId, reviewId);
 	}
 	
 	public void evaluateAndGrantBadges(Long memberId) {
        int totalWeight = badgeMapper.getTotalContentLengthByMemberId(memberId);

        List<Badge> eligibleBadges = badgeMapper.findEligibleBadges(totalWeight);

        for (Badge badge : eligibleBadges) {
            if (!badgeMapper.hasBadge(memberId, badge.getId())) {
                badgeMapper.insertMemberBadge(memberId, badge.getId());
            }
        }
    }
 	
 	public List<Badge> getBadgesByMemberId(Long memberId) {
        return badgeMapper.findBadgesByMemberId(memberId);
    }
 	
 	//여권 도장용 추가코드
 	public List<Reserv> getReservsWithoutReview(Long memberId){
 		List<Reserv> list = reviewMapper.findReservWithoutReview(memberId);
 		for (Reserv r : list) {
 		    System.out.println("Reserv ID..........: " + r.getId());
 		    System.out.println("Trip Title..........: " + 
 		        (r.getTripPlan() != null ? r.getTripPlan().getTitle() : "null"));
 		}
 		return reviewMapper.findReservWithoutReview(memberId);
 	}
 	public List<MyReviewDto> getReviewsWithPlaceTypeByMemberId(Long memberId){
 	    return reviewMapper.findReviewsWithPlaceTypeByMemberId(memberId);
 	}

}
