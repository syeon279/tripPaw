package com.ssdam.tripPaw;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.PassportSeal;
import com.ssdam.tripPaw.domain.PetPassport;
import com.ssdam.tripPaw.domain.PlaceType;
import com.ssdam.tripPaw.domain.Review;
import com.ssdam.tripPaw.domain.ReviewType;
import com.ssdam.tripPaw.domain.Seal;
import com.ssdam.tripPaw.petpass.seal.PassportSealMapper;
import com.ssdam.tripPaw.petpass.seal.SealMapper;
import com.ssdam.tripPaw.petpassport.PetPassportMapper;
import com.ssdam.tripPaw.place.PlaceTypeMapper;
import com.ssdam.tripPaw.review.ReviewMapper;
import com.ssdam.tripPaw.review.ReviewTypeMapper;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@RunWith(SpringRunner.class)
public class PetTest {
	@Autowired
	private PetPassportMapper petPassportMapper;
	@Autowired
	private SealMapper sealMapper;
	@Autowired
	private PlaceTypeMapper placeTypeMapper;
	@Autowired
	private PassportSealMapper passportSealMapper;
	@Autowired
	private ReviewMapper reviewMapper;
	@Autowired
	private ReviewTypeMapper reviewTypeMapper;
	private Seal testSeal;

	// 리뷰 더미데이터
	// @Test
	void insertReviewTypeAndDummyReviews() {
		// 1. 리뷰 타입 더미 데이터 삽입
		ReviewType reviewType = new ReviewType();
		reviewType.setTargetType("장소");

		reviewTypeMapper.insertReviewType(reviewType); // ID가 자동 설정됨
		System.out.println("삽입된 ReviewType ID: " + reviewType.getId());

		// 2. 리뷰 10개 삽입
		Member member = new Member();
		member.setId(1L); // 실제 존재하는 member_id

		for (int i = 1; i <= 10; i++) {
			Review review = new Review();
			review.setMember(member);
			review.setReviewType(reviewType);
			review.setContent("더미 리뷰 내용 " + i);
			review.setRating((int) (Math.random() * 5) + 1); // 1~5 랜덤 평점
			review.setTargetId(1L); // 실제 존재하는 대상 ID
			review.setWeatherCondition("맑음");
			review.setCreatedAt(LocalDateTime.now().minusDays(i));

			reviewMapper.insertReview(review);

			System.out.println("삽입된 리뷰 ID: " + review.getId());
		}
	}

	// p-s삽입
	//@Test
	void insertAndFindById() {
		Seal seal = new Seal();
		seal.setId(3L);

		PetPassport passport = new PetPassport();
		passport.setId(1L);

		Review review = new Review();
		review.setId(1L);

		PassportSeal passportSeal = new PassportSeal();
		passportSeal.setSeal(seal);
		passportSeal.setPassport(passport);
		passportSeal.setReview(review);

		passportSealMapper.insert(passportSeal);
		PassportSeal found = passportSealMapper.findById(passportSeal.getId());

		assertThat(found).isNotNull();
		assertThat(found.getSeal().getId()).isEqualTo(3L);
		assertThat(found.getReview().getId()).isEqualTo(1L);
	}

	//여권조회-도장이랑
	//@Test
	void findByPassportId_withExistingData() {
	    Long passportId = 1L;

	    List<PassportSeal> list = passportSealMapper.findByPassportId(passportId);

	    assertThat(list).isNotEmpty();
	    assertThat(list.get(0).getSeal()).isNotNull();
	    assertThat(list.get(0).getReview()).isNotNull();
	}

	//@Test
	void delete_withExistingData() {
	    Long existingId = 3L; 

	    passportSealMapper.delete(existingId);

	    PassportSeal deleted = passportSealMapper.findById(existingId);
	    assertThat(deleted).isNull();
	}      
	
	
//-------
	
	//플레이스타입 더미데이터
	//@Test
	void insertDummyPlaceTypes() {
		for (int i = 1; i <= 10; i++) {
			PlaceType placeType = new PlaceType();
			placeType.setName("장소타입" + i);
			placeTypeMapper.insert(placeType);
			System.out.println("삽입된 ID: " + placeType.getId() + ", 이름: " + placeType.getName());
		}
	}
	
	@BeforeEach
    void setUp() {
        PlaceType placeType = new PlaceType();
        placeType.setId(2L); // DB에 placetype_id = 1이 있어야 함

        testSeal = new Seal();
        testSeal.setName("테스트 도장");
        testSeal.setImageUrl("http://example.com/seal.png");
        testSeal.setPlaceType(placeType);
    }
	
	//도장등록
	//@Test
    void testInsertSeal() {
        sealMapper.insert(testSeal);
        assertThat(testSeal.getId()).isNotNull();
    }
    
    //도장수정
    //@Test
    void testUpdateSeal() {
        sealMapper.insert(testSeal);

        testSeal.setName("new 도장");
        sealMapper.update(testSeal);

        Seal updated = sealMapper.findById(testSeal.getId());
        assertThat(updated.getName()).isEqualTo("new 도장");
    }
    
    //도장 삭제
    //@Test
    void testDeleteSeal() {
        sealMapper.insert(testSeal);
        Long id = testSeal.getId();

        sealMapper.delete(id);
        Seal deleted = sealMapper.findById(id);

        assertThat(deleted).isNull();
    }
    
    //전체조회
    //@Test
    void testFindAll() {
        sealMapper.insert(testSeal);
        List<Seal> seals = sealMapper.findAll();

        assertThat(seals).isNotEmpty();
    }
    
    //타입별조회
    //@Test
    void testFindByPlaceTypeId() {
        sealMapper.insert(testSeal);
        List<Seal> seals = sealMapper.findByPlaceTypeId(1L);

        assertThat(seals).isNotEmpty();
        assertThat(seals.get(0).getPlaceType().getId()).isEqualTo(1L);
    }

	
//----

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
		List<PetPassport> pass = petPassportMapper.selectPassportsByMemberId(2L);
		PetPassport pp = pass.get(0);
		
		pp.setPetName("new");
		pp.setPetAge(7);
		petPassportMapper.updatePetPassport(pp);
		
	    List<PetPassport> updatedList = petPassportMapper.selectPassportsByMemberId(2L);
	    PetPassport updated = updatedList.get(updatedList.size() - 1); // 가장 최근 여권


	    assertEquals("new", updated.getPetName());
	    assertEquals(7, updated.getPetAge());
	}

	//여권 삭제
   //@Test
    void testDeletePetPassport() {
    	int deleted = petPassportMapper.deletePetPassport(6L);
    	assertEquals(1, deleted);
    }
    
    //단일항목조회
    //@Test
    public void testSelectPassId() {
    	PetPassport pass = petPassportMapper.selectPassportById(1L);
    	System.out.println(pass);
    }
    
    //여권조회-멤버ID
    //@Test
    public void testSelectMemberId() {
    	List<PetPassport> pass = petPassportMapper.selectPassportsByMemberId(2L);
    	assertNotNull(pass);
    	System.out.println(pass);
    }
    
    //여권조회-도장포함
    //@Test
    public void testSelectWithSeal() {
		PetPassport pass = petPassportMapper.selectPassportWithSeals(4L);
		assertNotNull(pass);
    	System.out.println(pass);
	}
    
    
    
}
