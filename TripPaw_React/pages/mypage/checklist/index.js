// pages/mypage/checklist.js
import MypageLayout from '@/components/layout/MypageLayout';
import ChecklistTemplateList from '@/components/checklist/ChecklistTemplateList';
import { Divider } from 'antd';
import ChecklistItemManager from '@/components/checklist/ChecklistItemManager';

const ChecklistPage = () => {
  return (
    <> 
    <MypageLayout>
      <ChecklistTemplateList />
      <Divider/>
      <ChecklistItemManager/>
    </MypageLayout>
    </>
  );
};

export default ChecklistPage;
