// ✅ 3. components/checklist/ItemSection.js
import React, { useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import { getAllItems } from '@/api/checkTemplateItem';
import ItemFormModal from './ItemFormModal';

const ItemSection = () => {
  const [items, setItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const fetchItems = async () => {
    const data = await getAllItems();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>체크리스트 항목</h2>
        <Button onClick={() => setOpenModal(true)}>항목 추가</Button>
      </div>
      <Table
        rowKey="id"
        columns={[
          { title: '내용', dataIndex: 'content' },
          { title: '대분류', dataIndex: 'largeCategory' },
          // 수정/삭제 버튼은 이후 추가
        ]}
        dataSource={items}
      />
      <ItemFormModal open={openModal} onClose={() => setOpenModal(false)} onRefresh={fetchItems} />
    </div>
  );
};

export default ItemSection;