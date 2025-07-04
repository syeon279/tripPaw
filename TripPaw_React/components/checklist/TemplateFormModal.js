// ✅ 4. components/checklist/TemplateFormModal.js
import React, { useState } from 'react';
import { Modal, Input, Select, message } from 'antd';
import { createTemplate } from '@/api/checkTemplate';

const TemplateFormModal = ({ open, onClose, onRefresh }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');

  const handleSubmit = async () => {
    try {
      await createTemplate({ title, type });
      message.success('템플릿 생성 완료');
      onRefresh();
      onClose();
    } catch (e) {
      message.error('오류 발생');
    }
  };

  return (
    <Modal open={open} onCancel={onClose} onOk={handleSubmit} title="템플릿 생성">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" style={{ marginBottom: 8 }} />
      <Select value={type} onChange={setType} placeholder="카테고리" style={{ width: '100%' }}>
        <Select.Option value="여행">여행</Select.Option>
        <Select.Option value="훈련">훈련</Select.Option>
      </Select>
    </Modal>
  );
};

export default TemplateFormModal;