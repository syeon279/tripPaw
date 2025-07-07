// pages/mypage/checklist/mychecklist/[id].js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getRoutinesByMember } from '@/api/checkRoutine'; 
import { List, Card } from 'antd';
import MypageLayout from '@/components/layout/MypageLayout';
import ChecklistRoutineList from '@/components/checklist/ChecklistRoutineList';

const MyChecklistPage = () => {
  return (
    <MypageLayout>
      <ChecklistRoutineList/>
    </MypageLayout>
  );
};

export default MyChecklistPage;
