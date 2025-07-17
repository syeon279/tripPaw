package com.ssdam.tripPaw;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.transaction.Transactional;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit4.SpringRunner;

import com.ssdam.tripPaw.checklist.CheckRoutineMapper;
import com.ssdam.tripPaw.checklist.CheckTemplateItemMapper;
import com.ssdam.tripPaw.checklist.CheckTemplateMapper;
import com.ssdam.tripPaw.checklist.MemberCheckMapper;
import com.ssdam.tripPaw.domain.CheckRoutine;
import com.ssdam.tripPaw.domain.CheckTemplate;
import com.ssdam.tripPaw.domain.CheckTemplateItem;
import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.MemberCheck;
import com.ssdam.tripPaw.domain.Route;
import com.ssdam.tripPaw.init.RouteDummyFactory;
import com.ssdam.tripPaw.init.RouteRepository;

@SpringBootTest
@RunWith(SpringRunner.class)
public class CheckTemplateMapperTest {
	@Autowired private CheckTemplateMapper mapper;
	@Autowired private CheckTemplateItemMapper itemMapper;
	@Autowired private CheckRoutineMapper routineMapper;
	@Autowired private MemberCheckMapper memberCheckMapper;
//--- MemberCheck	
	
	//1. 유저 체크리스트 삽입
	@Disabled //@Test
	public void testInsertAndSelectMemberCheck() {
	    // 루틴과 항목 조회 더미데이터 없으면 오류남
	    CheckRoutine routine = routineMapper.selectCheckRoutineById(1L);
	    CheckTemplateItem item = itemMapper.selectItemsByIds(Collections.singletonList(2L)).get(0);

	    // MemberCheck 생성
	    MemberCheck memberCheck = new MemberCheck();
	    memberCheck.setCheckRoutine(routine);
	    memberCheck.setCheckTemplateItem(item);
	    memberCheck.setCustomContent(null);
	    memberCheck.setIsChecked(false);

	    memberCheckMapper.insertMemberCheck(memberCheck);
	    assertNotNull(memberCheck.getId());

	    // 조회
	    List<MemberCheck> checks = memberCheckMapper.selectByRoutineId(routine.getId());
	    assertFalse(checks.isEmpty());
	    System.out.println("............................"+checks);
	}

	//2. 유저 체크리스트 수정
	@Disabled//@Test
	public void testUpdateMemberCheck() {
	    List<MemberCheck> checks = memberCheckMapper.selectByRoutineId(1L);
	    MemberCheck check = checks.get(0);

	    check.setCustomContent("커스텀 내용 수정");
	    check.setIsChecked(true);

	    int updated = memberCheckMapper.updateMemberCheck(check);
	    assertEquals(1, updated);

	    MemberCheck updatedCheck = memberCheckMapper.selectByRoutineId(1L).get(0);
	    assertEquals("커스텀 내용 수정", updatedCheck.getCustomContent());
	    assertTrue(updatedCheck.isChecked());
	}

	//3. 유저체크리스트 삭제
	@Disabled //@Test
	public void testDeleteMemberCheck() {
	    // 임의 데이터 준비
	    MemberCheck memberCheck = new MemberCheck();
	    memberCheck.setCheckRoutine(routineMapper.selectCheckRoutineById(1L));
	    memberCheck.setCheckTemplateItem(itemMapper.selectItemsByIds(Collections.singletonList(1L)).get(0));
	    memberCheck.setIsChecked(false);
	    memberCheck.setCustomContent(null);

	    memberCheckMapper.insertMemberCheck(memberCheck);
	    Long id = memberCheck.getId();
	    assertNotNull(id);

	    // 삭제
	    int deleted = memberCheckMapper.deleteMemberCheckById(id);
	    assertEquals(1, deleted);
	}
	
	//4.루틴별 조회
	@Disabled //@Test
	public void testSelectByRoutineId() {
	    Long routineId = 1L; // 임의로 루틴 ID 지정
	    List<MemberCheck> list = memberCheckMapper.selectByRoutineId(routineId);

	    System.out.println("✔ 루틴 ID = " + routineId + " 의 MemberCheck 목록:");
	    list.forEach(mc -> System.out.println("ID: " + mc.getId() + ", 내용: " + mc.getCustomContent()));

	    assertFalse(list.isEmpty());
	}

	//5. 멤버별 조회
	@Disabled //@Test
	public void testSelectByMemberId() {
	    Long memberId = 1L; // 실제 존재하는 멤버 ID 사용할 것
	    List<MemberCheck> list = memberCheckMapper.selectByMemberId(memberId);

	    System.out.println("✔ 멤버 ID = " + memberId + " 의 MemberCheck 목록:");
	    list.forEach(mc -> {
	        System.out.println("체크 ID: " + mc.getId() +
	                           ", 루틴 ID: " + mc.getCheckRoutine().getId() +
	                           ", 내용: " + mc.getCustomContent());
	    });

	    assertFalse(list.isEmpty());
	}	
	
	//6. 루트별 조회
	@Disabled //@Test
	public void testSelectMemberChecksByRouteId() {
	    Long routeId = 1L; // 존재하는 route_id 사용

	    List<MemberCheck> checks = memberCheckMapper.selectByRouteId(routeId);
	    
	    System.out.println("루트 ID = " + routeId + " 로 조회된 MemberCheck 리스트:");
	    for (MemberCheck check : checks) {
	        System.out.printf("체크 ID: %d, 루틴 ID: %d, 내용: %s, 체크됨?: %b%n",
	                check.getId(),
	                check.getCheckRoutine().getId(),
	                check.getCustomContent(),
	                check.isChecked());
	    }
	}
	
//--- CheckRoutine	

	// 1. 루틴 생성
    @Disabled //@Test
    public void testInsertRoutine() {
        CheckRoutine routine = new CheckRoutine();
        routine.setTitle("TEST Routine");
        routine.setIsSaved(true);

        Member member = new Member();
        member.setId(2L);
        routine.setMember(member);

        Route route = new Route();
        route.setId(2L);
//        routine.setRoute(route);

        routineMapper.insertCheckRoutine(routine);
        assertNotNull(routine.getId());
        System.out.println("생성된 루틴 ID: " + routine.getId());
    }

    //2. 루틴 전체목록 조회
    // 2. 전체 조회
    @Disabled //@Test
    public void testSelectAllRoutines() {
        List<CheckRoutine> routines = routineMapper.selectAllCheckRoutines();
        assertNotNull(routines);
        routines.forEach(System.out::println);
    }
    
    //3. 멤버 루틴 전체목록조회
    // 2-1. 유저별 루틴 전체 조회
    @Disabled //@Test
    public void testSelectRoutinesByMemberId() {
        Long memberId = 2L;
        List<CheckRoutine> routines = routineMapper.selectRoutinesByMemberId(memberId);
        assertNotNull(routines);
        routines.forEach(System.out::println);
    }

    //4. 단일 루틴 조회
    // 3. 단건 조회
    @Disabled //@Test
    public void testSelectRoutineById() {
        CheckRoutine routine = routineMapper.selectCheckRoutineById(2L);
        assertNotNull(routine);
        System.out.println(routine.getTitle());
    }

    //5. 루틴업데이트
    // 4. 루틴수정
    @Disabled //@Test
    public void testUpdateRoutine() {
        CheckRoutine routine = routineMapper.selectCheckRoutineById(2L);
        assertNotNull(routine);

        routine.setTitle("수정된 루틴 제목");
        routine.setIsSaved(false);

        Member member = new Member();
        member.setId(1L);
        routine.setMember(member);

        Route route = new Route();
        route.setId(1L);
//        routine.setRoute(route);

        int updatedRows = routineMapper.updateCheckRoutine(routine);
        assertEquals(1, updatedRows);
    }
    
    //6. 루틴 삭제
    // 5. 루틴삭제
    @Disabled //@Test
    public void testDeleteRoutine() {
        Long id = 1L;
        int deleted = routineMapper.deleteCheckRoutineById(id);
        assertEquals(1, deleted);
    }
	
	
//-- 템플릿
    //1. 템플릿 목록조회
	@Disabled //@Test
	public void TempselectAll() {
		List<CheckTemplate> list = mapper.selectAllTemplates();
        assertNotNull(list);
        System.out.println(list);
	}
	
	//2. 단일 템플릿 조회-아이템 포함
	@Disabled //@Test 
	public void TempselectItem() {
		CheckTemplate template = mapper.selectTemplateWithItems(1L);
        assertNotNull(template);
        System.out.println(template.getItems());
	}
	
	//3. 템플릿 생성
	@Disabled //@Test 
	public void TempCreate() {
	    CheckTemplate template = new CheckTemplate();
	    template.setTitle("테스트 템플릿");
	    template.setType(1001);

	    Member member = new Member();
	    member.setId(1L);
	    template.setMember(member);
	    mapper.insertTemplate(template);

	    //item 기존항목 ID
	    List<Long> itemIds = Arrays.asList(1L, 2L, 3L);
	    List<CheckTemplateItem> selectedItems = itemMapper.selectItemsByIds(itemIds);
	    
	    for(CheckTemplateItem item : selectedItems) {
	        item.setId(null);
	        item.setChecktemplateId(template.getId());
	    }
	    
	    itemMapper.insertTemplateItems(selectedItems);
	}
	
	//4. 템플릿수정
	@Disabled //@Test
	public void TempUpdate() {
		Long templateId = 12L; // 수정할 템플릿 ID

	    // 템플릿 정보 수정
	    CheckTemplate template = new CheckTemplate();
	    template.setId(templateId);
	    template.setTitle("수정된 템플릿 제목");
	    template.setType(2002);
	    mapper.updateTemplate(template);

	    // 기존 항목 삭제
	    mapper.deleteTemplateItemsByTemplateId(templateId);

	    // 새 항목 복사하여 연결 (예: ID 4, 5를 복사)
	    List<Long> itemIds = Arrays.asList(4L, 5L);
	    List<CheckTemplateItem> selectedItems = itemMapper.selectItemsByIds(itemIds);

	    for (CheckTemplateItem item : selectedItems) {
	        item.setId(null); // 새 항목으로 삽입
	        item.setChecktemplateId(templateId);
	    }

	    itemMapper.insertTemplateItems(selectedItems);
	}

	//5. 템플릿 삭제
	@Disabled //@Test
	public void TemplateAllDelete() {
	    Long templateIdToDelete = 12L;
	    //항목삭제
	    mapper.deleteTemplateItemsByTemplateId(templateIdToDelete);
	    //템플릿삭제
	    mapper.deleteTemplateById(templateIdToDelete);	    
	    
	    System.out.println("삭제된 템플릿 ID: " + templateIdToDelete);
	}

//--- 템플릿 항목	
	
	//1. 단일항목생성
	@Disabled //@Test 
    public void insertSingleItemTest() {
        CheckTemplateItem item = new CheckTemplateItem();
        item.setChecktemplateId(11L);
        item.setContent("단일 항목 테스트");

        itemMapper.insertTemplateItem(item);
        assertNotNull(item.getId());
        System.out.println("삽입된 ID: " + item.getId());
    }
	
	//2. 전체항목조회
	@Disabled //@Test
	public void selectAllItemsTest() {
	    List<CheckTemplateItem> items = itemMapper.selectAllItems();
	    assertNotNull(items);
	    System.out.println("전체 항목 수.............................: " + items.size());
	    for (CheckTemplateItem item : items) {
	        System.out.println("ID: " + item.getId() + ", 내용: " + item.getContent());
	    }
	}
	
	//3. 단일항목삭제
	@Disabled //@Test
    public void deleteSingleItemTest() {
        int deleted = itemMapper.deleteItemById(49L);
        assertEquals(1, deleted);
    }
	
	
// -- Route 더미데이터용
	@Autowired private RouteRepository routeRepository;

    @Disabled //@Test
    public void insertDummyRoutes() {
        List<Route> dummyRoutes = RouteDummyFactory.createDummyRoutes();
        routeRepository.saveAll(dummyRoutes);

        // 확인용 출력
        List<Route> allRoutes = routeRepository.findAll();
        allRoutes.forEach(route -> System.out.println("Inserted: " + route.getName()));
    }

// -- memberCheck 더미데이터용
    //루틴이랑 템플릿 비어있으면 오류남
    @Disabled //@Test
    public void testInsertMemberCheckDummyData() {
        // 루틴 10개, 템플릿아이템 10개 가정
        List<CheckRoutine> routines = routineMapper.selectAllCheckRoutines();
        List<CheckTemplateItem> items = itemMapper.selectAllItems();

        for (int i = 0; i < 15; i++) {
            MemberCheck memberCheck = new MemberCheck();
            memberCheck.setCheckRoutine(routines.get(i % routines.size()));
            memberCheck.setCheckTemplateItem(items.get(i % items.size()));
            memberCheck.setCustomContent("더미 체크 " + (i + 1));
            memberCheck.setIsChecked(i % 2 == 0); // true/false 번갈아가며 설정

            memberCheckMapper.insertMemberCheck(memberCheck);
            System.out.println("삽입 완료 - ID: " + memberCheck.getId());
        }
    }

}