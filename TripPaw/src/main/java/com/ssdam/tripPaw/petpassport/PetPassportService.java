package com.ssdam.tripPaw.petpassport;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.PetPassport;
import lombok.RequiredArgsConstructor;

@Service @RequiredArgsConstructor
public class PetPassportService  {
	
	private final PetPassportMapper petPassportMapper;

	//여권생성
    public void createPassport(PetPassport passport) {
        petPassportMapper.insertPetPassport(passport);
    }

    //여권조회-여권ID
    public PetPassport getPassportById(Long passportId) {
        return petPassportMapper.selectPassportById(passportId);
    }

    //여권조회-멤버기준
    public List<PetPassport> getPassportsByMemberId(Long memberId) {
        return petPassportMapper.selectPassportsByMemberId(memberId);
    }

    //여권조회-도장
    public PetPassport getPassportWithSeals(Long passportId) {
        return petPassportMapper.selectPassportWithSeals(passportId);
    }

    //여권번호중복검사
    public boolean isPassNumDuplicate(String passNum) {
        return petPassportMapper.countByPassNum(passNum) > 0;
    }

    //여권수정
    public void updatePassport(PetPassport passport) {
        petPassportMapper.updatePetPassport(passport);
    }

    //여권삭제
    public boolean deletePassport(Long passportId) {
        return petPassportMapper.deletePetPassport(passportId) > 0;
    }

}
