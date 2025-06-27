package com.ssdam.tripPaw.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "member_point")
@Data
public class MemberPoint {

    @Id
    @Column(name = "member_id")
    private Long memberId;

    @Column(nullable = false)
    private Integer point;
}
