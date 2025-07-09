package com.ssdam.tripPaw.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.MemberTripPlan;
import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.Reserv;
import com.ssdam.tripPaw.reserv.ReservState;

import lombok.Data;

@Data
public class TripPlanCoursePlaceDto {
    private Long memberTripPlanId;
    private Long tripPlanId;
    private Long placeId;
    private String placeName;
    private Double latitude;
    private Double longitude;

    private LocalDate startDate;
    private LocalDate endDate;

    public Reserv toReserv(Member member, Place place, MemberTripPlan memberTripPlan) {
        Reserv reserv = new Reserv();
        reserv.setStartDate(this.startDate);
        reserv.setEndDate(this.endDate);
        reserv.setState(ReservState.WAITING);
        reserv.setMember(member);
        reserv.setPlace(place);
        reserv.setMemberTripPlan(memberTripPlan);
        reserv.setCreatedAt(LocalDateTime.now());
        return reserv;
    }
}
