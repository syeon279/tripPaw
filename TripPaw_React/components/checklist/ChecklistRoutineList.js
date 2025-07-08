import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Collapse, message, Spin, Button, Input } from 'antd';
import { getRoutinesByMember } from '@/api/checkRoutine';
import { getMemberChecksByRoutineId } from '@/api/memberCheck'; // API 호출 추가
import { addMemberCheck, updateMemberCheck, deleteItem } from '@/api/memberCheck';

const ChecklistRoutineList = () => {
  const router = useRouter();
  const { id: memberId } = router.query;
  const [routines, setRoutines] = useState([]);
  const [routineItems, setRoutineItems] = useState({});
  const [loadingItems, setLoadingItems] = useState({});
  const [newItemContent, setNewItemContent] = useState('');

  useEffect(() => {
    if (memberId) {
      getRoutinesByMember(memberId)
        .then(setRoutines)
        .catch(() => message.error('루틴을 불러오지 못했습니다.'));
    }
  }, [memberId]); 

  const handleCollapseChange = async (activeKey) => {
  if (!activeKey) return;
  const routineId = Number(activeKey);
  if (routineItems[routineId]) return;

  setLoadingItems((prev) => ({ ...prev, [routineId]: true }));
  try {
    const items = await getMemberChecksByRoutineId(routineId);
    console.log('Items......:', items); // 데이터  확인
    setRoutineItems((prev) => ({ ...prev, [routineId]: items }));
  } catch (e) {
    message.error('항목을 불러오지 못했습니다.');
  } finally {
    setLoadingItems((prev) => ({ ...prev, [routineId]: false }));
  }
};

  const handleAddItem = async (routineId) => {
    console.log('1. handleAddItem called with:', routineId, newItemContent);
    if (!newItemContent.trim()) return;

    try {
        const routine = await getMemberChecksByRoutineId(routineId); 
        console.log('2. Adding item:', { custom_content: newItemContent, routineId });

        await addMemberCheck({
            custom_content: newItemContent,
            checkRoutine: routine, 
        });

        setNewItemContent(''); 
        handleCollapseChange(routineId);
    } catch (error) {
        console.error('3. Error adding item:', error);
        message.error('항목 추가 실패');
    }
};

  const handleUpdateItem = async (itemId, content) => {
    try {
      await updateMemberCheck(itemId, content); // 항목 수정 시 custom_content로 업데이트
      handleCollapseChange(itemId); // 항목 수정 후 다시 불러오기
    } catch {
      message.error('항목 수정 실패');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteItem(itemId); // 항목 삭제
      message.success('항목이 삭제되었습니다.');
      handleCollapseChange(itemId); // 삭제 후 다시 불러오기
    } catch {
      message.error('항목 삭제 실패');
    }
  };

  return (
    <div>
      <h3>나의 체크리스트</h3>
      <Collapse accordion onChange={handleCollapseChange}>
        {routines.map((routine) => (
          <Collapse.Panel header={routine.title} key={routine.id}>
            {loadingItems[routine.id] ? (
              <Spin />
            ) : (
              <>
                <ul>
                  {routineItems[routine.id]?.length ? (
                    routineItems[routine.id].map((item) => (
                      <li key={item.id}>
                        <span>{item.customContent || item.checkTemplateItem?.content}</span>
                        <Button
                          size="small"
                          onClick={() => handleUpdateItem(item.id, item.customContent || item.checkTemplateItem?.content)}
                        >
                          수정
                        </Button>
                        <Button size="small" danger onClick={() => handleDeleteItem(item.id)}>
                          삭제
                        </Button>
                      </li>
                    ))
                  ) : (
                    <li>항목없음</li>
                  )}
                </ul>
                {/* 항목 추가 입력란 및 버튼 */}
                <Input
                  value={newItemContent}
                  onChange={(e) => setNewItemContent(e.target.value)}
                  placeholder="새 항목 입력"
                  style={{ marginBottom: 12 }}
                />
                <Button
                  type="primary"
                  onClick={() => handleAddItem(routine.id)}
                  style={{ marginBottom: 12 }}
                >
                  항목 추가
                </Button>
              </>
            )}
          </Collapse.Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default ChecklistRoutineList;
