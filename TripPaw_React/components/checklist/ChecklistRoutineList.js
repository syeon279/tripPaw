// components/checklist/ChecklistRoutineList.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Collapse, message } from 'antd';
import { getRoutinesByMember } from '@/api/checkRoutine';

const ChecklistRoutineList = () => {
  const router = useRouter();
  const { id: memberId } = router.query;
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    if (memberId) {
      getRoutinesByMember(memberId)
        .then(setRoutines)
        .catch(() => message.error('루틴을 불러오지 못했습니다.'));
    }
  }, [memberId]);

  return (
    <div>
      <h3>나의 체크리스트</h3>
      <Collapse accordion>
        {routines.map((routine) => (
          <Collapse.Panel header={routine.title} key={routine.id}>
            <ul>
              {routine.checkTemplateItems?.map((item) => (
                <li key={item.id}>{item.content}</li>
              ))}
            </ul>
          </Collapse.Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default ChecklistRoutineList;
