// components/checklist/TemplateSection.js
import React, { useEffect, useState } from 'react';
import { Button, Collapse, Modal, Input, Select, Table, message, Popconfirm } from 'antd';
import { getTemplates, getTemplateWithItems, createTemplate, updateTemplate, deleteTemplate } from '@/api/checkTemplate';
import { getAllItems } from '@/api/checkTemplateItem';

const { Panel } = Collapse;

const TemplateSection = () => {
  const [templates, setTemplates] = useState([]);
  const [items, setItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', type: '', selectedItemIds: [] });

  const fetchTemplates = async () => {
    const data = await getTemplates();
    setTemplates(data);
  };

  const fetchItems = async () => {
    const data = await getAllItems();
    setItems(data);
  };

  const fetchTemplateDetail = async (id) => {
    const data = await getTemplateWithItems(id);
    return data.items || [];
  };

  useEffect(() => {
    fetchTemplates();
    fetchItems();
  }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.type) return;
    try {
      if (editingId) {
        await updateTemplate(editingId, form);
        message.success('템플릿 수정 완료');
      } else {
        await createTemplate(form);
        message.success('템플릿 생성 완료');
      }
      setForm({ title: '', type: '', selectedItemIds: [] });
      setEditingId(null);
      setOpenModal(false);
      fetchTemplates();
    } catch {
      message.error('오류 발생');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTemplate(id);
      message.success('삭제 완료');
      fetchTemplates();
    } catch {
      message.error('삭제 실패');
    }
  };

  const handleEdit = (tpl) => {
    setForm({
      title: tpl.title,
      type: tpl.type,
      selectedItemIds: tpl.items?.map((item) => item.id) || [],
    });
    setEditingId(tpl.id);
    setOpenModal(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>체크리스트 템플릿</h2>
        <Button type="primary" onClick={() => setOpenModal(true)}>
          템플릿 생성
        </Button>
      </div>
      <Collapse accordion>
        {templates.map((tpl) => (
          <Panel header={tpl.title} key={tpl.id}>
            <p>카테고리: {tpl.type}</p>
            <Button onClick={() => handleEdit(tpl)} style={{ marginRight: 8 }}>
              수정
            </Button>
            <Popconfirm title="삭제하시겠습니까?" onConfirm={() => handleDelete(tpl.id)}>
              <Button danger>삭제</Button>
            </Popconfirm>
            <TemplateItemList templateId={tpl.id} fetchTemplateDetail={fetchTemplateDetail} />
          </Panel>
        ))}
      </Collapse>

      <Modal
        open={openModal}
        title={editingId ? '템플릿 수정' : '템플릿 생성'}
        onCancel={() => {
          setOpenModal(false);
          setForm({ title: '', type: '', selectedItemIds: [] });
          setEditingId(null);
        }}
        onOk={handleSubmit}
      >
        <Input
          placeholder="제목"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{ marginBottom: 8 }}
        />
        <Select
          placeholder="카테고리"
          value={form.type}
          onChange={(v) => setForm({ ...form, type: v })}
          style={{ width: '100%', marginBottom: 8 }}
        >
          <Select.Option value="여행">여행</Select.Option>
          <Select.Option value="훈련">훈련</Select.Option>
        </Select>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="체크리스트 항목 선택"
          value={form.selectedItemIds}
          onChange={(v) => setForm({ ...form, selectedItemIds: v })}
        >
          {items.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.content}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

const TemplateItemList = ({ templateId, fetchTemplateDetail }) => {
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    fetchTemplateDetail(templateId).then(setItemList);
  }, [templateId]);

  return (
    <ul style={{ marginTop: 16 }}>
      {itemList.map((item) => (
        <li key={item.id}>{item.content}</li>
      ))}
    </ul>
  );
};

export default TemplateSection;
