import { useEffect, useState } from 'react';
import { Table, Button, Input, Modal, Form, Space } from 'antd';
import { getAllItems, addItem, updateItem, deleteItem } from '@/api/checkTemplateItem';

const ChecklistItemManager = () => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchItems = async () => {
    const data = await getAllItems();
    console.log('전체 항목:', data);
    setItems(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editingItem) {
      await updateItem(editingItem.id, { ...editingItem, ...values });
    } else {
      await addItem(values);
    }
    setModalVisible(false);
    setEditingItem(null);
    fetchItems();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    form.setFieldsValue({ content: item.content });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    await deleteItem(id);
    fetchItems();
  };

  const columns = [
    { title: '이름', dataIndex: 'content', key: 'content' }, // ✅ 수정
    {
      title: '동작',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>수정</Button>
          <Button danger onClick={() => handleDelete(record.id)}>삭제</Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{display:'flex', justifyContent:'space-between', marginTop:32}}>
        <h3>전체 체크리스트 항목</h3>
        <Button type="primary" onClick={() => { setModalVisible(true); form.resetFields(); }}>
          항목 추가
        </Button>
      </div>
      <Table columns={columns} dataSource={items} rowKey="id" pagination={{ pageSize: 5 }} />
      <Modal
        open={modalVisible}
        title={editingItem ? '항목 수정' : '항목 추가'}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          setEditingItem(null);
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="이름"
            name="content" // ✅ 수정
            rules={[{ required: true, message: '이름을 입력하세요' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ChecklistItemManager;
