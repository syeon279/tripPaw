import { Modal, Collapse, List, Input, Checkbox, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import {
  getTemplates,
  getTemplateWithItems,
} from '@/api/checkTemplate';
import {
  getRoutinesByMember,
  getMemberChecksByRoutineId,
  createRoutineFromTemplates,
} from '@/api/memberCheck';

export default function CheckRoutineModal({ open, onClose, memberId, memberTripPlanId }) {
  const [adminTemplates, setAdminTemplates] = useState([]);
  const [myRoutines, setMyRoutines] = useState([]);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState([]);
  const [routineTitle, setRoutineTitle] = useState('');
  const [savePersonalRoutine, setSavePersonalRoutine] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (open) {
      // 관리자 템플릿 + 항목 병합
      getTemplates().then(async (templates) => {
        const enriched = await Promise.all(
          templates.map(async (t) => {
            const detail = await getTemplateWithItems(t.id);
            return {
              id: t.id,
              title: t.title ?? detail.title,
              items: detail.items,
            };
          })
        );
        setAdminTemplates(enriched);
      });

      // 사용자 루틴 + 항목 병합
      getRoutinesByMember(memberId).then(async (routines) => {
        const enriched = await Promise.all(
          routines.map(async (r) => {
            const items = await getMemberChecksByRoutineId(r.id);
            return { ...r, items };
          })
        );
        setMyRoutines(enriched);
      });

      setSelectedTemplateIds([]);
      setRoutineTitle('');
    }
  }, [open]);

  const toggleTemplate = (id) => {
    setSelectedTemplateIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!routineTitle.trim()) {
      message.warning('루틴 제목을 입력해주세요');
      return;
    }
    if (!selectedTemplateIds.length) {
      message.warning('템플릿을 선택해주세요');
      return;
    }

    setCreating(true);
    try {
      await createRoutineFromTemplates({
        memberId,
        memberTripPlanId,
        templateIds: selectedTemplateIds,
        title: routineTitle,
        isSaved: savePersonalRoutine,
      });
      message.success('체크리스트가 생성되었습니다');
      onClose();
    } catch (err) {
      console.error(err);
      message.error('체크리스트 생성 실패');
    } finally {
      setCreating(false);
    }
    
  };
  

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="여행 체크리스트 만들기" width={720}>
      <Input
        value={routineTitle}
        onChange={(e) => setRoutineTitle(e.target.value)}
        placeholder="체크리스트 제목 입력"
        style={{ marginBottom: 12 }}
      />

      <Checkbox
        checked={savePersonalRoutine}
        onChange={(e) => setSavePersonalRoutine(e.target.checked)}
        style={{ marginBottom: 16 }}
      >
        내 루틴으로도 저장하기
      </Checkbox>

      <Collapse accordion>
        {/* 📂 관리자 체크리스트 */}
        <Collapse.Panel header="📂 관리자 체크리스트" key="admin">
          {adminTemplates.map((template) => (
            <Collapse key={template.id}>
              <Collapse.Panel
                header={`📌 ${template.title}`}
                key={`template-${template.id}`}
                extra={
                  <Button
                    size="small"
                    type={selectedTemplateIds.includes(template.id) ? 'primary' : 'default'}
                    onClick={() => toggleTemplate(template.id)}
                  >
                    {selectedTemplateIds.includes(template.id) ? '선택됨' : '선택'}
                  </Button>
                }
              >
                <List
                  size="small"
                  bordered
                  dataSource={template.items}
                  renderItem={(item) => <List.Item>{item.content}</List.Item>}
                />
              </Collapse.Panel>
            </Collapse>
          ))}
        </Collapse.Panel>

        {/* 📂 나의 체크리스트 */}
        <Collapse.Panel header="📂 나의 체크리스트" key="user">
          {myRoutines.map((routine) => (
            <Collapse key={routine.id}>
              <Collapse.Panel header={`📌 ${routine.title}`} key={`routine-${routine.id}`}>
                <List
                  size="small"
                  bordered
                  dataSource={routine.items}
                  renderItem={(item) => (
                    <List.Item>
                      {item.customContent ?? item.checkTemplateItem?.content}
                    </List.Item>
                  )}
                />
              </Collapse.Panel>
            </Collapse>
          ))}
        </Collapse.Panel>
      </Collapse>

      <Button
        type="primary"
        block
        style={{ marginTop: 24 }}
        loading={creating}
        disabled={!routineTitle || !selectedTemplateIds.length}
        onClick={handleCreate}
      >
        체크리스트 생성
      </Button>
    </Modal>
  );
}
