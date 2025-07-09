//항목 1개 단위 출력 및 편집/삭제
import { useState } from 'react';
import { List, Checkbox, Button, Space, message } from 'antd';
import ChecklistItemEditorModal from './ChecklistItemEditorModal';
import { deleteMemberCheck, updateMemberCheck } from '@/api/memberCheck';

const ChecklistItemRow = ({ item, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const content = item.customContent ?? item.checkTemplateItem?.content ?? '내용 없음';

  const handleDelete = async () => {
    try {
      await deleteMemberCheck(item.id);
      message.success('항목이 삭제되었습니다.');
      onRefresh();
    } catch (err) {
      message.error('항목 삭제 실패');
    }
  };

  const handleCheckChange = async (e) => {
    try {
      await updateMemberCheck(item.id, { ...item, isChecked: e.target.checked });
      onRefresh();
    } catch (err) {
      message.error('체크 상태 변경 실패');
    }
  };

  return (
    <List.Item
      actions={[
        <Button onClick={() => setIsModalOpen(true)}>수정</Button>,
        <Button danger onClick={handleDelete}>삭제</Button>,
      ]}
    >
      <Space>
        <Checkbox checked={item.isChecked} onChange={handleCheckChange} />
        <span>{content}</span>
      </Space>

      {/* 항목 수정 모달 */}
      <ChecklistItemEditorModal
        item={item}
        visible={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          onRefresh();
        }}
      />
    </List.Item>
  );
};

export default ChecklistItemRow;
