package com.ssdam.tripPaw.tripPlan;

import com.ssdam.tripPaw.dto.TripRecommendRequest;
import com.ssdam.tripPaw.dto.TripRecommendResponse;
import com.ssdam.tripPaw.dto.TripSaveRequest;
import com.ssdam.tripPaw.place.PlaceMapper;
import com.ssdam.tripPaw.domain.*;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class TripPlanService {

    private final PlaceMapper placeMapper;
    private final TripPlanMapper tripPlanMapper;

    @Value("${upload.directory:C:/upload/tripThumbnails/}")
    private String uploadDir;

    public List<TripRecommendResponse> recommend(TripRecommendRequest request) {
        LocalDate startDate = LocalDate.parse(request.getStartDate());
        LocalDate endDate = LocalDate.parse(request.getEndDate());
        int totalDays = calculateTripDays(startDate, endDate);

        List<TripRecommendResponse> tripPlans = new ArrayList<>();

        for (int i = 0; i < totalDays; i++) {
            List<Place> dailyPlaces = placeMapper.findRecommendedPlacesByRandom(
                request.getRegion(), request.getSelectedCategoryIds()
            );

            List<TripRecommendResponse.PlaceInfo> placeInfos = dailyPlaces.stream()
                .map(p -> new TripRecommendResponse.PlaceInfo(
                    p.getId(), p.getName(), p.getDescription(), p.getLatitude(), p.getLongitude(), p.getImageUrl()))
                .collect(Collectors.toList());

            tripPlans.add(new TripRecommendResponse(i + 1, placeInfos, startDate, endDate));
        }

        return tripPlans;
    }

    private int calculateTripDays(LocalDate startDate, LocalDate endDate) {
        return (int) ChronoUnit.DAYS.between(startDate, endDate) + 1;
    }

    public void saveTrip(TripSaveRequest request) {
        try {
            // 🖼️ 이미지 저장: 클라이언트에서 전달한 Base64를 파일로 저장
            String imagePath = saveBase64Image(request.getMapImage());
            System.out.println("🖼️ 지도 이미지 저장 완료: " + imagePath);

            // 여행 정보 저장
            TripPlan tripPlan = new TripPlan();
            tripPlan.setTitle(request.getTitle());
            tripPlan.setDays(request.getRouteData().size());
            tripPlan.setPublicVisible(true);
            tripPlan.setImageUrl(imagePath);

            Member member = new Member();
            member.setId(1L); // TODO: 실제 로그인 사용자 ID 연동 필요
            tripPlan.setMember(member);

            tripPlanMapper.insertTripPlan(tripPlan);
            System.out.println("📌 TripPlan 저장 완료");

            // 루트 및 장소 저장
            for (TripSaveRequest.RouteDay routeDay : request.getRouteData()) {
                Route route = new Route();
                route.setName(request.getTitle() + "_" + routeDay.getDay() + "일차");
                tripPlanMapper.insertRoute(route);

                AtomicInteger sequence = new AtomicInteger(1);
                for (TripSaveRequest.PlaceDto placeDto : routeDay.getPlaces()) {
                    Place place = new Place();
                    place.setId(placeDto.getPlaceId());

                    RoutePlace routePlace = new RoutePlace();
                    routePlace.setRoute(route);
                    routePlace.setPlace(place);
                    routePlace.setSequence(sequence.getAndIncrement());

                    tripPlanMapper.insertRoutePlace(routePlace);
                }

                TripPlanCourse course = new TripPlanCourse();
                course.setTripPlan(tripPlan);
                course.setRoute(route);
                tripPlanMapper.insertTripPlanCourse(course);
            }

            System.out.println("✅ 여행 저장 전체 완료");

        } catch (Exception e) {
            System.err.println("❌ 여행 저장 실패: " + e.getMessage());
            throw new RuntimeException("여행 저장 실패", e);
        }
    }

    /**
     * 📥 클라이언트에서 전달된 Base64 PNG 이미지 저장
     */
    private String saveBase64Image(String base64Data) {
        if (base64Data == null || base64Data.isBlank()) {
            System.out.println("⚠️ Base64 이미지 없음 - 저장 생략");
            return null;
        }

        try {
            String[] parts = base64Data.split(",");
            String imageBytesString = (parts.length > 1) ? parts[1] : parts[0];
            byte[] imageBytes = Base64.getDecoder().decode(imageBytesString);

            String fileName = UUID.randomUUID().toString() + ".png";
            Path savePath = Paths.get(uploadDir, fileName);
            Files.createDirectories(savePath.getParent());

            try (InputStream in = new ByteArrayInputStream(imageBytes)) {
                Files.copy(in, savePath, StandardCopyOption.REPLACE_EXISTING);
            }

            return "/thumbnails/" + fileName; // 웹에서 접근 가능한 URL 포맷으로 반환
        } catch (Exception e) {
            System.err.println("❌ Base64 이미지 저장 실패: " + e.getMessage());
            throw new RuntimeException("Base64 이미지 저장 실패", e);
        }
    }

    public List<TripPlan> getAllTrips() {
        return tripPlanMapper.findAllTrips();
    }
}
