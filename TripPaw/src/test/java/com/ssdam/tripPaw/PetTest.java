package com.ssdam.tripPaw;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.PetPassport;
import com.ssdam.tripPaw.petpassport.PetPassportMapper;

@SpringBootTest
@RunWith(SpringRunner.class)
public class PetTest {
	@Autowired private PetPassportMapper petPassportMapper;

	//여권생성
	@Disabled
	void testInsertAndSelect() {
        PetPassport passport = new PetPassport();
        Member member = new Member();
        member.setId(2L);
        passport.setMember(member);
        passport.setPetName("설기");
        passport.setSpecies("먼치킨");
        passport.setPetAge(5);
        passport.setPetGender("M");
        passport.setPassNum(UUID.randomUUID().toString().substring(0, 10));
        passport.setCreatedAt(LocalDateTime.now());

        petPassportMapper.insertPetPassport(passport);
        assertNotNull(passport.getId());
    }

	//여권수정
	@Disabled	//@Test
	void testUpdatePetPassport() {
	    // given
	    PetPassport passport = createTestPassport(2L, "몽실이");
	    petPassportMapper.insertPetPassport(passport);

	    // when
	    passport.setPetName("몽실이 수정");
	    passport.setPetAge(5);
	    petPassportMapper.updatePetPassport(passport);

	    List<PetPassport> updatedList = petPassportMapper.selectPassportsByMemberId(2L);
	    PetPassport updated = updatedList.get(updatedList.size() - 1); // 가장 최근 여권

	    // then
	    assertEquals("몽실이 수정", updated.getPetName());
	    assertEquals(5, updated.getPetAge());
	}

//   // @Test
//    void testDeletePetPassport() {
//        PetPassport passport = createTestPassport("지니");
//        petPassportMapper.insertPetPassport(passport);
//
//        petPassportMapper.deletePetPassport(passport.getId());
//
//        PetPassport deleted = petPassportMapper.selectPassportById(passport.getId());
//        assertNull(deleted);
//    }

//    //@Test
//    void testCountByPassNum() {
//        PetPassport passport = createTestPassport("쿠키");
//        petPassportMapper.insertPetPassport(passport);
//
//        int count = petPassportMapper.countByPassNum(passport.getPassNum());
//        assertEquals(1, count);
//    }
    
    // 테스트용 여권 객체 생성
    private PetPassport createTestPassport(Long memberId, String petName) {
        PetPassport passport = new PetPassport();
        Member member = new Member();
        member.setId(memberId);
        passport.setMember(member);
        passport.setPetName(petName);
        passport.setSpecies("푸들");
        passport.setPetAge(3);
        passport.setPetGender("F");
        passport.setImageUrl("test.jpg");
        passport.setPassNum(UUID.randomUUID().toString().substring(0, 10));
        passport.setCreatedAt(LocalDateTime.now());
        return passport;
    }
}
