import { Button, Popconfirm, Space } from 'antd';

const TemplateActionButtons = ({ template, onEdit, onOpenModal, onDelete }) => (
  <Space style={{ marginTop: 12 }}>
    <Button
      onClick={() => {
        onEdit(template);
        onOpenModal();
      }}
    >
      ✏️ 수정
    </Button>
    <Popconfirm
      title="정말 삭제하시겠습니까?"
      onConfirm={() => onDelete(template.id)}
      okText="삭제"
      cancelText="취소"
    >
      <Button danger>🗑 삭제</Button>
    </Popconfirm>
  </Space>
);

export default TemplateActionButtons;
