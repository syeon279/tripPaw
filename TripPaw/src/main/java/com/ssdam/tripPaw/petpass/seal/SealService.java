package com.ssdam.tripPaw.petpass.seal;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.Seal;

import lombok.RequiredArgsConstructor;

@Service @RequiredArgsConstructor
public class SealService {
	
	private final SealMapper sealMapper;

    // 전체 도장 조회
    public List<Seal> getAllSeals() { return sealMapper.findAll(); }

    // 장소 타입별 도장 조회
    public List<Seal> getSealsByPlaceType(Long placeTypeId) { return sealMapper.findByPlaceTypeId(placeTypeId); }

    // 단건 조회
    public Seal getSealById(Long id) { return sealMapper.findById(id);}

    // 도장 등록
    public void createSeal(Seal seal) { sealMapper.insert(seal); }

    // 도장 수정
    public void updateSeal(Seal seal) {sealMapper.update(seal);}

    // 도장 삭제
    public void deleteSeal(Long id) { sealMapper.delete(id); }
	
}
