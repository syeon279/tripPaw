package com.ssdam.tripPaw.memberTripPlan;

import com.ssdam.tripPaw.domain.MemberTripPlan;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MemberTripPlanMapper {

    /*
     * ID로 단건 조회
     */
    MemberTripPlan findById(@Param("id") Long id);

    /*
     * 사용자 ID로 모든 여행 조회
     */
    List<MemberTripPlan> findByMemberId(@Param("memberId") Long memberId);

    /*
     * 새로운 여행 계획 삽입
     */
    int insert(MemberTripPlan memberTripPlan);

    /*
     * 기존 여행 계획 수정
     */
    int update(MemberTripPlan memberTripPlan);

    /*
     * 소프트 삭제 (member_id → 1로 설정)
     */
    int delete(@Param("id") Long memberId);
}
