package com.ssdam.tripPaw.tripPlan;

import com.ssdam.tripPaw.dto.TripRecommendRequest;
import com.ssdam.tripPaw.dto.TripRecommendResponse;
import com.ssdam.tripPaw.dto.TripSaveRequest;
import com.ssdam.tripPaw.memberTripPlan.MemberTripPlanMapper;
import com.ssdam.tripPaw.place.PlaceMapper;
import com.ssdam.tripPaw.domain.*;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.io.ByteArrayInputStream;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
	private final MemberTripPlanMapper memberTripPlanMapper;

	@Value("${upload.directory:C:/upload/tripThumbnails/}")
	private String uploadDir;

	// 여행 추천 받기
	public List<TripRecommendResponse> recommend(TripRecommendRequest request) {
		LocalDate startDate = LocalDate.parse(request.getStartDate());
		LocalDate endDate = LocalDate.parse(request.getEndDate());
		int totalDays = calculateTripDays(startDate, endDate);

		List<TripRecommendResponse> tripPlans = new ArrayList<>();

		for (int i = 0; i < totalDays; i++) {
			List<TripRecommendResponse.PlaceInfo> placeInfos = new ArrayList<>();

			// 1. 첫 장소: 관광지(placeType 1) 랜덤 추천
			Place firstPlace = placeMapper.findFirstRandomPlace(
				request.getRegion(), request.getSelectedCategoryIds());
			if (firstPlace == null) continue;
			placeInfos.add(toPlaceInfo(firstPlace));

			// 2. 두 번째 장소: 음식점(placeType 6), 첫 장소 기준 가까운 순
			Place secondPlace = findNearestPlace(6, request, firstPlace);
			if (secondPlace != null) placeInfos.add(toPlaceInfo(secondPlace));

			// 3. 세 번째 장소: 랜덤 타입 하나 (3, 5, 1 중)
			int[] randomTypes = {3, 5, 1};
			int randomType = randomTypes[new Random().nextInt(randomTypes.length)];
			Place thirdPlace = findNearestPlace(randomType, request, secondPlace != null ? secondPlace : firstPlace);
			if (thirdPlace != null) placeInfos.add(toPlaceInfo(thirdPlace));

			// 4. 네 번째 장소: 숙박 (4)
			Place fourthPlace = findNearestPlace(4, request, thirdPlace != null ? thirdPlace : (secondPlace != null ? secondPlace : firstPlace));
			if (fourthPlace != null) placeInfos.add(toPlaceInfo(fourthPlace));

			tripPlans.add(new TripRecommendResponse(i + 1, placeInfos, startDate, endDate));
		}

		return tripPlans;
	}

	private Place findNearestPlace(int placeType, TripRecommendRequest request, Place base) {
		List<Place> candidates = placeMapper.findPlacesByTypeAndDistance(
			placeType,
			request.getRegion(),
			request.getSelectedCategoryIds(),
			base.getLatitude(),
			base.getLongitude(),
			1
		);
		if (candidates == null || candidates.isEmpty()) {
			candidates = placeMapper.findPlacesByTypeAndDistance(
				placeType,
				request.getRegion(),
				Collections.emptyList(),
				base.getLatitude(),
				base.getLongitude(),
				1
			);
		}
		return candidates.isEmpty() ? null : candidates.get(0);
	}

	private TripRecommendResponse.PlaceInfo toPlaceInfo(Place place) {
		return new TripRecommendResponse.PlaceInfo(
			place.getId(),
			place.getName(),
			place.getDescription(),
			String.valueOf(place.getLatitude()),
			String.valueOf(place.getLongitude()),
			place.getImageUrl()
		);
	}

	private int calculateTripDays(LocalDate startDate, LocalDate endDate) {
		return (int) ChronoUnit.DAYS.between(startDate, endDate) + 1;
	}

	public TripPlan saveTrip(TripSaveRequest request) {
		TripPlan tripPlan = new TripPlan();
		try {
			String imagePath = saveBase64Image(request.getMapImage());
			tripPlan.setTitle(request.getTitle());
			tripPlan.setDays(request.getRouteData().size());
			tripPlan.setPublicVisible(false);
			tripPlan.setImageUrl(imagePath);
			Member member = new Member();
			member.setId(request.getMemberId()); 
			tripPlan.setMember(member);
			tripPlanMapper.insertTripPlan(tripPlan);

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

		} catch (Exception e) {
			throw new RuntimeException("여행 저장 실패", e);
		}
		return tripPlan;
	}

	public void saveMemberTrip(TripSaveRequest request) {
		try {
			String imagePath = saveBase64Image(request.getMapImage());
			TripPlan tripPlan = new TripPlan();
			tripPlan.setTitle(request.getTitle());
			tripPlan.setDays(request.getRouteData().size());
			tripPlan.setPublicVisible(false);
			tripPlan.setImageUrl(imagePath);
			Member member = new Member();
			member.setId(request.getMemberId()); 
			tripPlan.setMember(member);
			tripPlanMapper.insertTripPlan(tripPlan);

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

			MemberTripPlan memberTripPlan = new MemberTripPlan();
			memberTripPlan.setMember(member);
			memberTripPlan.setTripPlan(tripPlan);
			memberTripPlan.setTitleOverride(request.getTitle());
			memberTripPlan.setPublicVisible(false);
			memberTripPlan.setStartDate(LocalDate.parse(request.getStartDate()));
			memberTripPlan.setEndDate(LocalDate.parse(request.getEndDate()));
			memberTripPlan.setCreatedAt(LocalDateTime.now());
			memberTripPlan.setCountPeople(request.getCountPeople());
			memberTripPlan.setCountPet(request.getCountPet());
			memberTripPlan.setImageUrl(imagePath);
			memberTripPlanMapper.insert(memberTripPlan);

		} catch (Exception e) {
			throw new RuntimeException("여행 저장 실패", e);
		}
	}

	private String saveBase64Image(String base64Data) {
		if (base64Data == null || base64Data.isBlank()) return null;
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
			return "/thumbnails/" + fileName;
		} catch (Exception e) {
			throw new RuntimeException("Base64 이미지 저장 실패", e);
		}
	}

	public List<TripPlan> getAllTrips() {
		return tripPlanMapper.findAllTrips();
	}

	public TripPlan findByIdWithCourses(Long id) {
		return tripPlanMapper.findByIdWithCourses(id);
	}
}
