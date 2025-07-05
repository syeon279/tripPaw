// components/checklist/ItemSection.js
import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Input, Select, message } from 'antd';
import { getAllItems, addItem, updateItem, deleteItem } from '@/api/checkTemplateItem';

const { Option } = Select;

const ItemSection = () => {
  const [items, setItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  const fetchItems = async () => {
    const data = await getAllItems();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setOpenModal(true);
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    await deleteItem(id);
    message.success('삭제되었습니다.');
    fetchItems();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem) {
        await updateItem(editingItem.id, values);
        message.success('수정되었습니다.');
      } else {
        await addItem(values);
        message.success('추가되었습니다.');
      }
      setOpenModal(false);
      fetchItems();
    } catch (error) {
      console.error('폼 유효성 실패', error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>체크리스트 항목</h2>
        <Button onClick={handleAdd}>항목 추가</Button>
      </div>
      <Table
        rowKey="id"
        columns={[
          { title: '내용', dataIndex: 'content' },
          { title: '대분류', dataIndex: 'largeCategory' },
          {
            title: '작업',
            render: (_, record) => (
              <>
                <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>수정</Button>
                <Button danger onClick={() => handleDelete(record.id)}>삭제</Button>
              </>
            ),
          },
        ]}
        dataSource={items}
      />

      <Modal
        open={openModal}
        title={editingItem ? '항목 수정' : '항목 추가'}
        onCancel={() => setOpenModal(false)}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="content" label="내용" rules={[{ required: true, message: '내용을 입력하세요.' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="largeCategory" label="대분류" rules={[{ required: true, message: '대분류를 입력하세요.' }]}> 
            <Select>
              <Option value="여행 준비물">여행 준비물</Option>
              <Option value="건강 관리">건강 관리</Option>
              <Option value="기타">기타</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ItemSection;
