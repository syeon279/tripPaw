// pages/mypage/checklist/mychecklist/[id].js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MypageLayout from '@/components/layout/MypageLayout';
import ChecklistRoutineList from '@/components/checklist/ChecklistRoutineList';
import axios from 'axios';

const MyChecklistPage = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
  const checkUser = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/auth/check', {
        withCredentials: true,
      });

      if (response.status === 200) {
        const data = response.data;
        console.log('auth:', data.auth); // 확인용

        setUser({
          nickname: data.nickname,
          username: data.username,
          memberId : data.memberId,
        });

        setIsAdmin(data.auth === 'ADMIN');
      }
    } catch (error) {
      console.error('사용자 정보 확인 실패:', error);
      setIsAdmin(false);
    }
  };

  checkUser();
}, []);

  return (
    <MypageLayout>
      <ChecklistRoutineList />
    </MypageLayout>
  );
};

export default MyChecklistPage;
