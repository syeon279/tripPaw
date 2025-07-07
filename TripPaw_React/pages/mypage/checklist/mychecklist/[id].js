import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getRoutineWithItems, updateRoutine, deleteRoutine } from '@/api/checkRoutine'; // API 수정
import { addItem, updateItem, deleteItem } from '@/api/checkTemplateItem';
import { Button, Input, List, Modal, message } from 'antd';

export default function MyCheckListDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [routine, setRoutine] = useState(null); // template -> routine으로 변경
  const [items, setItems] = useState([]);
  const [newItemContent, setNewItemContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (id) {
      loadRoutine(id); // loadTemplate -> loadRoutine 변경
    }
  }, [id]);

  const loadRoutine = async (routineId) => {
    try {
      const data = await getRoutineWithItems(routineId); // API 호출 수정
      setRoutine(data); // template -> routine으로 변경
      setItems(data.items); // 루틴 항목 설정
      setEditTitle(data.title); // 루틴 제목 설정
    } catch (error) {
      message.error('루틴 로딩 실패');
    }
  };

  const handleUpdateRoutine = async () => {
    try {
      await updateRoutine(routine.id, { title: editTitle }); // 수정된 API에 맞게 호출
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
          await deleteRoutine(routine.id); // 수정된 API에 맞게 호출
          message.success('삭제되었습니다');
          router.push('/mypage/checklist');
        } catch {
          message.error('삭제 실패');
        }
      },
    });
  };

  const handleAddItem = async () => {
    if (!newItemContent.trim()) return;
    const newItem = {
      content: newItemContent,
      routineId: routine.id, // templateId -> routineId로 변경
    };
    try {
      await addItem(newItem);
      setNewItemContent('');
      loadRoutine(routine.id);
    } catch {
      message.error('항목 추가 실패');
    }
  };

  const handleUpdateItem = async (itemId, newContent) => {
    try {
      await updateItem(itemId, { content: newContent });
      loadRoutine(routine.id); // 수정된 API에 맞게 호출
    } catch {
      message.error('항목 수정 실패');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteItem(itemId);
      loadRoutine(routine.id); // 수정된 API에 맞게 호출
    } catch {
      message.error('항목 삭제 실패');
    }
  };

  if (!routine) return null;

  return (
    <div style={{ padding: 24 }}>
      <h2>내 체크리스트 루틴</h2>

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
    </div>
  );
}

function EditableItem({ item, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(item.content);

  const handleSave = () => {
    onUpdate(item.id, content);
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
        <span>{item.content}</span>
      )}
    </List.Item>
  );
}
