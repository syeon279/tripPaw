// ✅ 5. components/checklist/ItemFormModal.js
import React, { useState } from 'react';
import { Modal, Input, Select, message } from 'antd';
import { addItem } from '@/api/checkTemplateItem';

const ItemFormModal = ({ open, onClose, onRefresh }) => {
  const [content, setContent] = useState('');
  const [largeCategory, setLargeCategory] = useState('');

  const handleSubmit = async () => {
    try {
      await addItem({ content, largeCategory });
      message.success('항목 추가 완료');
      onRefresh();
      onClose();
    } catch (e) {
      message.error('오류 발생');
    }
  };

  return (
    <Modal open={open} onCancel={onClose} onOk={handleSubmit} title="항목 추가">
      <Input value={content} onChange={(e) => setContent(e.target.value)} placeholder="내용" style={{ marginBottom: 8 }} />
      <Select value={largeCategory} onChange={setLargeCategory} placeholder="대분류" style={{ width: '100%' }}>
        <Select.Option value="여행">여행</Select.Option>
        <Select.Option value="건강">건강</Select.Option>
      </Select>
    </Modal>
  );
};

export default ItemFormModal;