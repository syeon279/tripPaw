// ✅ 2. components/checklist/TemplateSection.js
import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Input, Select } from 'antd';
import { getTemplates, createTemplate } from '@/api/checkTemplate';
import TemplateFormModal from './TemplateFormModal';

const TemplateSection = () => {
  const [templates, setTemplates] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const fetchTemplates = async () => {
    const data = await getTemplates();
    setTemplates(data);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>체크리스트 템플릿</h2>
        <Button type="primary" onClick={() => setOpenModal(true)}>템플릿 생성</Button>
      </div>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {templates.map((tpl) => (
          <Card key={tpl.id} title={tpl.title} style={{ width: 300 }}>
            <p>카테고리: {tpl.type}</p>
            {/* 수정/삭제 버튼 등 추가 */}
          </Card>
        ))}
      </div>
      <TemplateFormModal open={openModal} onClose={() => setOpenModal(false)} onRefresh={fetchTemplates} />
    </div>
  );
};

export default TemplateSection;