import { useEffect, useState } from 'react';
import { Collapse, Button, message } from 'antd';
import { getTemplates, deleteTemplate } from '@/api/checkTemplate';
import ChecklistItemList from './ChecklistItemList';
import ChecklistTemplateModal from './ChecklistTemplateModal';
import TemplateActionButtons from './TemplateActionButtons';

const ChecklistTemplateList = ({ isAdmin }) => {
  const [templates, setTemplates] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (err) {
      message.error('템플릿 목록을 불러오는 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTemplate(id);
      message.success('템플릿이 삭제되었습니다.');
      fetchTemplates();
    } catch (err) {
      message.error('삭제 실패');
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingTemplate(null);
    fetchTemplates();
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <>
      <div style={{ marginBottom: 16, display:'flex', justifyContent: 'space-between' }}>
        <h3>체크리스트 템플릿</h3>
        <Button type="primary" onClick={() => setModalVisible(true)}>템플릿 생성</Button>
      </div>

      <Collapse accordion>
        {templates.map((template) => (
          <Collapse.Panel header={template.title} key={template.id}>
            <ChecklistItemList templateId={template.id} isAdmin={isAdmin} />

              <TemplateActionButtons
                template={template}
                onEdit={setEditingTemplate}
                onOpenModal={() => setModalVisible(true)}
                onDelete={handleDelete}
              />
          </Collapse.Panel>
        ))}
      </Collapse>

      <ChecklistTemplateModal
        visible={modalVisible}
        onClose={handleModalClose}
        editingTemplate={editingTemplate}
      />
    </>
  );
};

export default ChecklistTemplateList;
