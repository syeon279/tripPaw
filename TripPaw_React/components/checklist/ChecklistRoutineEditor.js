// components/checklist/ChecklistRoutineEditor.js
import { useState, useEffect } from 'react';
import { Input, Button, List, message, Modal } from 'antd';
import { getRoutineWithItems, updateRoutine, deleteRoutine } from '@/api/checkRoutine';
import { addItem, updateItem, deleteItem } from '@/api/checkTemplateItem';
import { updateMemberCheck } from '@/api/memberCheck'; // 수정된 항목 업데이트를 위한 API

export default function ChecklistRoutineEditor({ routineId, onDeleteSuccess }) {
  const [routine, setRoutine] = useState(null);
  const [items, setItems] = useState([]);
  const [newItemContent, setNewItemContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (routineId) loadRoutine(routineId);
  }, [routineId]);

  const loadRoutine = async (id) => {
    try {
      const data = await getRoutineWithItems(id);
      setRoutine(data);
      setItems(data.items);
      setEditTitle(data.title);
    } catch {
      message.error('루틴 로딩 실패');
    }
  };

  const handleUpdateRoutine = async () => {
    try {
      await updateRoutine(routine.id, { title: editTitle });
      message.success('루틴 제목이 수정되었습니다');
      setIsModified(false);
    } catch {
      message.error('루틴 수정 실패');
    }
  };

  const handleDeleteRoutine = async () => {
    Modal.confirm({
      title: '정말 삭제하시겠습니까?',
      onOk: async () => {
        try {
          await deleteRoutine(routine.id);
          message.success('삭제되었습니다');
          onDeleteSuccess?.();
        } catch {
          message.error('삭제 실패');
        }
      },
    });
  };

  const handleAddItem = async (routineId) => {
  if (!newItemContent.trim()) return;

  try {
    console.log('1. Adding item......:', { custom_content: newItemContent, routineId });  // 데이터 확인용
    await addMemberCheck({ custom_content: newItemContent, routineId });
    setNewItemContent(''); // 입력란 초기화
    handleCollapseChange(routineId); // 항목 추가 후 다시 불러오기
  } catch {
    message.error('항목 추가 실패');
  }
};

  const handleUpdateItem = async (itemId, content) => {
  try {
    await updateMemberCheck(itemId, content); 
    loadRoutine(routine.id); 
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

  if (!routine) return null;

  return (
    <>
      <Input
        value={editTitle}
        onChange={(e) => {
          setEditTitle(e.target.value);
          setIsModified(true);
        }}
        style={{ width: 300, marginBottom: 12 }}
      />
      <Button type="primary" onClick={handleUpdateRoutine} disabled={!isModified}>
        제목 수정
      </Button>
      <Button danger style={{ marginLeft: 8 }} onClick={handleDeleteRoutine}>
        루틴 삭제
      </Button>

      <div style={{ marginTop: 32 }}>
        <h3>항목 리스트</h3>
        <List
          bordered
          dataSource={items}
          renderItem={(item) => (
            <EditableItem
              key={item.id}
              item={item}
              onUpdate={handleUpdateItem}
              onDelete={handleDeleteItem}
            />
          )}
        />
        <div style={{ marginTop: 16 }}>
          <Input
            value={newItemContent}
            onChange={(e) => setNewItemContent(e.target.value)}
            placeholder="새 항목 입력"
            style={{ width: 300 }}
          />
          <Button type="primary" onClick={handleAddItem} style={{ marginLeft: 8 }}>
            항목 추가
          </Button>
        </div>
      </div>
    </>
  );
}

function EditableItem({ item, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(item.content);

  useEffect(() => {
    if (item.custom_content) {
      setContent(item.custom_content); // custom_content가 있으면 그것으로 수정
    }
  }, [item.custom_content]);

  const handleSave = () => {
    onUpdate(item.id, content); // custom_content로 업데이트
    setEditing(false);
  };

  return (
    <List.Item
      actions={[
        editing ? (
          <Button size="small" onClick={handleSave}>
            저장
          </Button>
        ) : (
          <Button size="small" onClick={() => setEditing(true)}>
            수정
          </Button>
        ),
        <Button size="small" danger onClick={() => onDelete(item.id)}>
          삭제
        </Button>,
      ]}
    >
      {editing ? (
        <Input value={content} onChange={(e) => setContent(e.target.value)} />
      ) : (
        <span>{content || '내용 없음'}</span>
      )}
    </List.Item>
  );
}
