// ✅ 6. pages/mypage/checklist/index.js
import React from 'react';
import ChecklistManagerLayout from '@/components/checklist/ChecklistManagerLayout';
import TemplateSection from '@/components/checklist/TemplateSection';
import ItemSection from '@/components/checklist/ItemSection';

const ChecklistPage = () => {
  return (
    <ChecklistManagerLayout>
      <TemplateSection />
      <ItemSection />
    </ChecklistManagerLayout>
  );
};

export default ChecklistPage;