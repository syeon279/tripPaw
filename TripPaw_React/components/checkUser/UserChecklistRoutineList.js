// /루틴 목록 조회 및 루틴 선택
import { Collapse, message } from 'antd';
import { useEffect, useState } from 'react';
import { getRoutinesByMemberId } from '@/api/checkRoutine';
import UserChecklistItemList from './UserChecklistItemList';
import RoutineActionButtons from './RoutineActionButtons';

const UserChecklistRoutineList = ({ memberId }) => {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRoutines = async () => {
    setLoading(true);
    try {
      const data = await getRoutinesByMemberId(memberId);
      setRoutines(data);
    } catch (err) {
      message.error('루틴 목록 불러오기 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (memberId) fetchRoutines();
  }, [memberId]);

  return (
    <>
      <h3 style={{ marginBottom: 16 }}>내 체크리스트 루틴</h3>

      <Collapse accordion>
        {routines.map((routine) => (
          <Collapse.Panel
            key={routine.id}
            header={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{routine.title}</span>
                <RoutineActionButtons routine={routine} onRefresh={fetchRoutines} />
              </div>
            }
          >
            <UserChecklistItemList routineId={routine.id} />
          </Collapse.Panel>
        ))}
      </Collapse>
    </>
  );
};

export default UserChecklistRoutineList;
