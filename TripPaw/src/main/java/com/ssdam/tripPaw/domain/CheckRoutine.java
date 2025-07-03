package com.ssdam.tripPaw.domain;
//유저 루틴

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import lombok.Getter;
import lombok.Setter;

@Entity @Getter @Setter
public class CheckRoutine {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String title;
	private boolean isSaved;
	private LocalDateTime createdAt = LocalDateTime.now();
	
	//유저아이디 연결
	@ManyToOne @JoinColumn(name="member_id")
	private Member member;
	
	//여행경로 아이디 연결
	@ManyToOne
	@JoinColumn(name = "route_id")
	private Route route;
	
	//membercheck
	@OneToMany(mappedBy = "checkRoutine", cascade = CascadeType.ALL)
	private List<MemberCheck> memberChecks = new ArrayList<>();
	
	//memberId
	public void setMemberId(Long memberId) {
        if (this.member == null) {
            this.member = new Member();   }
        this.member.setId(memberId);
    }

    // routeId
    public void setRouteId(Long routeId) {
        if (this.route == null) {
            this.route = new Route();
        }
        this.route.setId(routeId);
    }

    // isSaved 
    public void setIsSaved(boolean isSaved) { this.isSaved = isSaved; }
}
