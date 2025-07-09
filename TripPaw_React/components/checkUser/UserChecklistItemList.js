//루틴에 포함된 항목들
import { useEffect, useState } from 'react';
import { List, Checkbox, message } from 'antd';
import { getRoutineWithItems } from '@/api/memberCheck';
import ChecklistItemRow from './ChecklistItemRow';
import ChecklistItemAdder from './ChecklistItemAdder';

const UserChecklistItemList = ({ routineId }) => {
  const [items, setItems] = useState([]);
  const [routineTitle, setRoutineTitle] = useState('');

  const fetchRoutineItems = async () => {
    try {
      const routine = await getRoutineWithItems(routineId);
      setRoutineTitle(routine.title || '');
      setItems(routine.memberChecks || []);
    } catch (err) {
      message.error('루틴 항목을 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    if (routineId) fetchRoutineItems();
  }, [routineId]);

  return (
    <>
      <h4 style={{ marginBottom: 12 }}>{routineTitle} 루틴 항목</h4>

      <List
        itemLayout="horizontal"
        dataSource={items}
        locale={{ emptyText: '항목이 없습니다' }}
        renderItem={(item) => (
          <ChecklistItemRow
            item={item}
            onRefresh={fetchRoutineItems}
          />
        )}
      />

      <ChecklistItemAdder routineId={routineId} onRefresh={fetchRoutineItems} />
    </>
  );
};

export default UserChecklistItemList;
