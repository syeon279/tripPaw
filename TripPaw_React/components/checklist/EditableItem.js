// EditableItem.js
import { useState, useEffect } from 'react';
import { Input, Button } from 'antd';

const EditableItem = ({ item, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(item.customContent || item.checkTemplateItem?.content); 

  useEffect(() => {
    if (item.customContent) {
      setContent(item.customContent);
    } else if (item.checkTemplateItem?.content) {
      setContent(item.checkTemplateItem.content);
    }
  }, [item]);

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
        <span>{content || '내용 없음'}</span> // customContent나 content 출력
      )}
    </List.Item>
  );
};

export default EditableItem;
