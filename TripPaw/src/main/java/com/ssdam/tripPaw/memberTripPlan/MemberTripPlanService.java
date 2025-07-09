package com.ssdam.tripPaw.memberTripPlan;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.MemberTripPlan;
import com.ssdam.tripPaw.domain.TripPlan;
import com.ssdam.tripPaw.domain.TripPlanCourse;
import com.ssdam.tripPaw.dto.MemberTripPlanSaveRequest;
import com.ssdam.tripPaw.dto.MyTripsDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberTripPlanService {

	private final MemberTripPlanMapper memberTripPlanMapper;

	// 다른 유저의 TripPlan을 memberTripPlan으로 저장
	public void saveMemberTripPlan(MemberTripPlanSaveRequest request) {
        boolean alreadyExists = memberTripPlanMapper.existsByMemberIdAndTripPlanId(
            request.getMemberId(), request.getTripPlanId()
        );

        if (alreadyExists) {
            throw new IllegalStateException("이미 저장한 여행입니다.");
        }

        Member member = new Member();
        member.setId(request.getMemberId());

        TripPlan tripPlan = new TripPlan();
        tripPlan.setId(request.getTripPlanId());

        MemberTripPlan entity = MemberTripPlan.builder()
            .member(member)
            .tripPlan(tripPlan)
            .startDate(LocalDate.parse(request.getStartDate()))
            .endDate(LocalDate.parse(request.getEndDate()))
            .countPeople(request.getCountPeople())
            .countPet(request.getCountPet())
            .titleOverride(request.getTitleOverride())
            .build();

        memberTripPlanMapper.insertMemberTripPlan(entity);
    }

	// 특정 유저의 내 여행(TripPlan) 목록 조회
	@Transactional(readOnly = true)
	public List<MyTripsDto> getMyTripsByMember(Long memberId) {
		List<MemberTripPlan> myTrips = memberTripPlanMapper.findByMemberId(memberId);
		List<MyTripsDto> result = new ArrayList<>();

		for (MemberTripPlan mtp : myTrips) {
			if (mtp == null || mtp.getTripPlan() == null)
				continue;

			TripPlan tripPlan = mtp.getTripPlan();

			List<TripPlanCourse> tripPlanCourses = tripPlan.getTripPlanCourses();

			// 대표 이미지 설정
			String imageUrl = null;
			/*
			 * if (tripPlanCourses != null && !tripPlanCourses.isEmpty()) { TripPlanCourse
			 * firstCourse = tripPlanCourses.get(0); Place place = firstCourse.getPlace();
			 * if (place != null) { imageUrl = place.getImageUrl(); } }
			 */

			MyTripsDto dto = new MyTripsDto();
			dto.setMyTripId(mtp.getId());
			dto.setMemberId(memberId);
			dto.setTripPlanId(tripPlan.getId());
			dto.setTitle(tripPlan.getTitle());
			dto.setDays(tripPlan.getDays());
			dto.setStartDate(mtp.getStartDate());
			dto.setEndDate(mtp.getEndDate());
			dto.setPublicVisible(tripPlan.isPublicVisible());
			dto.setCreatedAt(tripPlan.getCreatedAt());
			dto.setImageUrl(imageUrl);
			dto.setTripPlanCourses(tripPlanCourses != null ? tripPlanCourses : new ArrayList<>());

			result.add(dto);
		}

		return result;
	}
}
