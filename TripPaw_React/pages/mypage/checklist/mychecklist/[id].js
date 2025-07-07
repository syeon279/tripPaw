// pages/mypage/checklist/mychecklist/[id].js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { checkAuthStatus } from '@/api/auth'; // 로그인 상태 확인 API
import MypageLayout from '@/components/layout/MyPageLayout';
import ChecklistRoutineList from '@/components/checklist/ChecklistRoutineList';

const MyChecklistPage = () => {
  const [user, setUser] = useState(null); // 유저 상태
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await checkAuthStatus();
      if (userInfo) {
        setUser(userInfo); // 유저 정보 저장
      } else {
        router.push('/login'); // 로그인되지 않았다면 로그인 페이지로 리다이렉트
      }
    };
    fetchUser();
  }, []);

  if (!user) return <div>로딩중...</div>; // 유저 정보를 받아올 때까지 로딩 화면 표시

  return (
    <MypageLayout>
      <ChecklistRoutineList />
    </MypageLayout>
  );
};

export default MyChecklistPage;
