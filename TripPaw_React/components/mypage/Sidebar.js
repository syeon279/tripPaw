import React, { useEffect, useState } from 'react';
import SidebarSection from './SidebarSection';
import SidebarItem from './SidebarItem';
import styled from 'styled-components';
import axios from 'axios';
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
    <Wrapper>
      {/* 유저 전용 항목 */}
      {!isAdmin && user && (
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
          <SidebarItem
            text="내 체크리스트"
            href="/mypage/checklist"
            active={router.pathname === '/mypage/checklist'}
          />
          <SidebarItem text="내 뱃지" href="/mypage/badges" />
        </>
      )}

      {/* 관리자 전용 항목 */}
      {isAdmin && (
        <>
          <SidebarSection title="관리자">
            <SidebarItem text="체크리스트 관리" href="/mypage/checklist" />
            <SidebarItem text="카테고리 관리" href="/mypage/categories" />
            <SidebarItem text="도장 관리" href="/mypage/badges/manage" />
            <SidebarItem text="신고 관리" href="/mypage/reports" />
          </SidebarSection>
        </>
      )}

      {!isAdmin && user &&(
        <Footer>
          <div style={{ cursor: 'pointer' }}>로그아웃</div>
          <div style={{ cursor: 'pointer' }}>탈퇴하기</div>
        </Footer>
      )}
      {isAdmin &&(
        <Footer>
          <div style={{ cursor: 'pointer' }}>로그아웃</div>
        </Footer>
      )}
    </Wrapper>
  );
};

export default Sidebar;
