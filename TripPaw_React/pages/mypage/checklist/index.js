// pages/mypage/checklist/index.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MypageLayout from '@/components/layout/MypageLayout';
import ChecklistTemplateList from '@/components/checklist/ChecklistTemplateList';
import ChecklistItemManager from '@/components/checklist/ChecklistItemManager';
import { Divider } from 'antd';
import axios from 'axios';

const ChecklistPage = () => {
  const [user, setUser] = useState(null); // 유저 상태
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부
  const router = useRouter();

  useEffect(() => {
  const checkUser = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/auth/check', { withCredentials: true,});

      if (response.status === 200) {
        const data = response.data;
        console.log('auth:', data.auth);

        setUser(data);
        setIsAdmin(data.auth === 'ADMIN');

        if(!isAdmin){router.push('/mypage');}
      }
    } catch (error) {
      console.error('사용자 정보 확인 실패:', error);
      setIsAdmin(false);
      router.push('/login');
    }
  };

  checkUser();
}, []);

  if (!user || isAdmin === null) return <div>로딩중...</div>; 

  return (
    <MypageLayout>
      <ChecklistTemplateList />
      <Divider />
      <ChecklistItemManager />
    </MypageLayout>
  );
};

export default ChecklistPage;
