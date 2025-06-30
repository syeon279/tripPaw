package com.ssdam.tripPaw.domain;
//관리자 체크리스트 템플릿(묶음) 관리 테이블

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

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity @Getter @Setter
@NoArgsConstructor
public class CheckTemplate {
	
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String title;
	private int type;
	private LocalDateTime createdAt = LocalDateTime.now();
	
	//유저 식별용 유저 아이디 필요
	@ManyToOne @JoinColumn(name="member_id")
	private Member member;
	
	@OneToMany(mappedBy = "checkTemplate", cascade = CascadeType.ALL)
    private List<CheckTemplateItem> items = new ArrayList<>();

	private CheckTemplate(Long id, String title, int type, LocalDateTime createdAt, Member member, List<CheckTemplateItem> items) {
		super();
		this.id = id;
		this.title = title;
		this.type = type;
		this.createdAt = createdAt;
		this.member = member;
		this.items = items;
	}
	
	//더미데이터용
	public CheckTemplate(Long id, String title, int type, Long memberId, String code) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.createdAt = LocalDateTime.now();
        this.member = new Member();
        this.member.setId(memberId);
        this.items = new ArrayList<>();
    }
	
	public Long getMemberId() {
	    return member != null ? member.getId() : null;
	}
	
}
