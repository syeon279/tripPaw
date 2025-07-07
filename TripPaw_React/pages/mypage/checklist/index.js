// pages/mypage/checklist/index.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { checkAuthStatus } from '@/api/auth'; // 로그인 상태 확인 API
import MypageLayout from '@/components/layout/MyPageLayout';
import ChecklistTemplateList from '@/components/checklist/ChecklistTemplateList';
import ChecklistItemManager from '@/components/checklist/ChecklistItemManager';
import { Divider } from 'antd';

const ChecklistPage = () => {
  const [user, setUser] = useState(null); // 유저 상태
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await checkAuthStatus();
      if (userInfo) {
        setUser(userInfo); // 유저 정보 저장
        if (userInfo.role === 'ADMIN') {
          setIsAdmin(true); // 관리자인 경우만 표시
        } else {
          router.push('/mypage'); // 관리자가 아니면 내 정보 페이지로 리다이렉트
        }
      } else {
        router.push('/login'); // 로그인되지 않았다면 로그인 페이지로 리다이렉트
      }
    };
    fetchUser();
  }, []);

  if (!user) return <div>로딩중...</div>; // 유저 정보를 받아올 때까지 로딩 화면 표시
  if (!isAdmin) return <div>관리자만 접근 가능합니다.</div>; // 관리자가 아닌 경우 접근 제한

  return (
    <MypageLayout>
      <ChecklistTemplateList />
      <Divider />
      <ChecklistItemManager />
    </MypageLayout>
  );
};

export default ChecklistPage;
