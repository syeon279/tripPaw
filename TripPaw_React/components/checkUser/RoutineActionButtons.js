import { Button, message, Space } from 'antd';
import { deleteRoutine, updateRoutine } from '@/api/checkRoutine';
import { useState } from 'react';
import RoutineEditorModal from './RoutineEditorModal';

const RoutineActionButtons = ({ routine, onRefresh }) => {
  const [visible, setVisible] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteRoutine(routine.id);
      message.success('루틴이 삭제되었습니다.');
      onRefresh();
    } catch (err) {
      message.error('루틴 삭제 실패');
    }
  };

  return (
    <Space>
      <Button size="small" onClick={() => setVisible(true)}>수정</Button>
      <Button size="small" danger onClick={handleDelete}>삭제</Button>

      {/* 수정 모달 */}
      <RoutineEditorModal
        routine={routine}
        visible={visible}
        onClose={() => {
          setVisible(false);
          onRefresh();
        }}
      />
    </Space>
  );
};

export default RoutineActionButtons;
