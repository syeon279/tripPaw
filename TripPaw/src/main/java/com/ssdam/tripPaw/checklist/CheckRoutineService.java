package com.ssdam.tripPaw.checklist;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.CheckRoutine;
import lombok.RequiredArgsConstructor;

@Service @RequiredArgsConstructor
public class CheckRoutineService {
	private final CheckRoutineMapper checkRoutineMapper;
	
    // 루틴 생성
    public void createRoutine(CheckRoutine checkRoutine) {
        checkRoutineMapper.insertCheckRoutine(checkRoutine);
    }

    // 루틴 단건 조회 + 포함된 체크 항목까지
    public CheckRoutine getRoutineWithItems(Long id) {
        return checkRoutineMapper.selectRoutineWithItemsById(id);
    }

    // 유저의 전체 루틴 조회
    public List<CheckRoutine> getRoutinesByMemberId(Long memberId) {
        return checkRoutineMapper.selectRoutinesByMemberId(memberId);
    }

    // 루틴 수정
    public void updateRoutine(CheckRoutine checkRoutine) {
        checkRoutineMapper.updateCheckRoutine(checkRoutine);
    }

    // 루틴 삭제
    public void deleteRoutine(Long id) {
        checkRoutineMapper.deleteCheckRoutineById(id);
    }
}
