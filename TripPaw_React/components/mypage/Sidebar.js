import React, { useEffect, useState } from 'react';
import SidebarSection from './SidebarSection';
import SidebarItem from './SidebarItem';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { checkAuthStatus } from '@/api/auth'; // 로그인 상태 확인 API

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
  const [user, setUser] = useState(null);  // 로그인된 유저 정보
  const [isAdmin, setIsAdmin] = useState(false);  // 관리자 여부

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await checkAuthStatus();
        console.log(userData);  // 인증된 사용자 데이터 출력

        // 로그인된 사용자 정보를 user 상태에 저장
        setUser(userData);

        // admin 권한 여부를 확인하여 isAdmin 상태에 저장
        if (userData.auth === 'ADMIN') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.log('인증되지 않음');
      }
    };

    fetchUser();
  }, []);

  if (!user) return null;  // 로그인되지 않은 상태에서는 아무것도 렌더링하지 않음

  return (
    <Wrapper>
      {/* 유저 전용 항목 */}
      {!isAdmin && (
        <>
          <SidebarSection title={`안녕하세요, ${user.nickname}님`}>
            <SidebarItem text="내 정보 관리" href="/mypage/profile" />
            <SidebarItem text="쿠폰함" href="/mypage/coupons" />
          </SidebarSection>

          <SidebarItem text="반려동물 여권" href="/mypage/passport" />
          <SidebarItem text="예약 내역 보기" href="/mypage/reservations" />
          <SidebarItem text="내 장소" href="/mypage/places" />
          <SidebarItem text="내 여행" href="/mypage/trips" />
          <SidebarItem text="내 리뷰 관리" href="/mypage/reviews" />
          <SidebarItem text="내 체크리스트" href="/mypage/checklist" active={router.pathname === '/mypage/checklist'} />
          <SidebarItem text="내 뱃지" href="/mypage/badges" />
        </>
      )}

      {/* 관리자 전용 항목 */}
      {isAdmin && (
        <>
          {/* 관리자 전용 항목 */}
          <SidebarSection title="관리자">
            <SidebarItem text="체크리스트 관리" href="/mypage/checklist" />
            <SidebarItem text="카테고리 관리" href="/mypage/categories" />
            <SidebarItem text="도장 관리" href="/mypage/badges/manage" />
            <SidebarItem text="신고 관리" href="/mypage/reports" />
          </SidebarSection>
        </>
      )}

      <Footer>
        <div style={{ cursor: 'pointer' }}>로그아웃</div>
        <div style={{ cursor: 'pointer' }}>탈퇴하기</div>
      </Footer>
    </Wrapper>
  );
};

export default Sidebar;
