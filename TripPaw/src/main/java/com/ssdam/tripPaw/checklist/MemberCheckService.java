package com.ssdam.tripPaw.checklist;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.CheckRoutine;
import com.ssdam.tripPaw.domain.MemberCheck;

import lombok.RequiredArgsConstructor;

@Service @RequiredArgsConstructor
public class MemberCheckService {
	
	private final MemberCheckMapper memberCheckMapper;
    private final CheckRoutineMapper checkRoutineMapper;

    // 체크리스트 항목 추가
    @Transactional
    public void addMemberCheck(MemberCheck memberCheck) {
        memberCheckMapper.insertMemberCheck(memberCheck);
    }

    // 루틴 ID 기준 체크리스트 조회
    public List<MemberCheck> getMemberChecksByRoutineId(Long routineId) {
        return memberCheckMapper.selectByRoutineId(routineId);
    }

    // 멤버 ID 기준 체크리스트 조회
    public List<MemberCheck> getMemberChecksByMemberId(Long memberId) {
        return memberCheckMapper.selectByMemberId(memberId);
    }

    // 경로 ID 기준 체크리스트 조회
    public List<MemberCheck> getMemberChecksByRouteId(Long routeId) {
        return memberCheckMapper.selectByRouteId(routeId);
    }

    // 체크리스트 항목 수정 (내용 or 체크여부)
    @Transactional
    public boolean updateMemberCheck(MemberCheck memberCheck) {
        int updated = memberCheckMapper.updateMemberCheck(memberCheck);
        return updated > 0;
    }

    // 체크리스트 항목 삭제
    @Transactional
    public boolean deleteMemberCheck(Long id) {
        int deleted = memberCheckMapper.deleteMemberCheckById(id);
        return deleted > 0;
    }

    // 루틴 삭제 시 해당 루틴에 속한 체크리스트 전체 삭제
    @Transactional
    public void deleteMemberChecksByRoutineId(Long routineId) {
        memberCheckMapper.deleteByRoutineId(routineId);
    }

    // (추가) 루틴 생성 - 체크리스트 생성시 필요
    @Transactional
    public CheckRoutine createCheckRoutine(CheckRoutine checkRoutine) {
        checkRoutineMapper.insertCheckRoutine(checkRoutine);
        return checkRoutine;
    }

    // 루틴과 그에 딸린 체크리스트 항목 모두 조회
    public CheckRoutine getRoutineWithItems(Long routineId) {
        return checkRoutineMapper.selectRoutineWithItemsById(routineId);
    }
    
    // (추가) 멤버 기준 루틴 전체 조회
    public List<CheckRoutine> getRoutinesByMemberId(Long memberId) {
        return checkRoutineMapper.selectRoutinesByMemberId(memberId);
    }
    
}
