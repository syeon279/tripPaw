import React from 'react';
import MyPageLayout from '@/components/layout/MyPageLayout';
import Sidebar from '@/components/mypage/Sidebar';
import ChecklistManagerLayout from '@/components/checklist/ChecklistManagerLayout';
import TemplateSection from '@/components/checklist/TemplateSection';
import ItemSection from '@/components/checklist/ItemSection';

const ChecklistPage = () => {
  return (
    <MyPageLayout>
      <div style={{ display: 'flex', height: '100%' }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <ChecklistManagerLayout>
            <TemplateSection />
            <ItemSection />
          </ChecklistManagerLayout>
        </div>
      </div>
    </MyPageLayout>
  );
};

export default ChecklistPage;
