// components/mypage/Sidebar.js
import React, { useEffect, useState } from 'react';
import SidebarSection from './SidebarSection';
import SidebarItem from './SidebarItem';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const Wrapper = styled.div`
  width: 240px;
  padding: 24px;
  border-right: 1px solid #ddd;
  height: 100%;
`;

const Footer = styled.div`
  margin-top: auto;
  padding-top: 32px;
  color: red;
`;

const Sidebar = () => {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState(null);

  useEffect(() => {
    setCurrentPath(router.pathname);
  }, [router.pathname]);

  return (
    <Wrapper>
      <SidebarSection title="안녕하세요 너구리님">
        <SidebarItem text="내 정보 관리" href="/mypage/profile" />
        <SidebarItem text="쿠폰함" href="/mypage/coupons" />
      </SidebarSection>

      <SidebarItem text="반려동물 여권" href="/mypage/passport" />
      <SidebarItem text="예약 내역 보기" href="/mypage/reservations" />
      <SidebarItem text="내 장소" href="/mypage/places" />
      <SidebarItem text="내 여행" href="/mypage/trips" />
      <SidebarItem text="내 리뷰 관리" href="/mypage/reviews" />
      <SidebarItem
        text="내 체크리스트"
        href="/mypage/checklist"
        active={currentPath === '/mypage/checklist'}
      />
      <SidebarItem text="내 뱃지" href="/mypage/badges" />

      <Footer>
        <div style={{ cursor: 'pointer' }}>로그아웃</div>
        <div style={{ cursor: 'pointer' }}>탈퇴하기</div>
      </Footer>
    </Wrapper>
  );
};

export default Sidebar;
