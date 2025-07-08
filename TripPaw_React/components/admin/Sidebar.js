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

  return (
    <Wrapper>
      <SidebarSection title="현재페이지는 관리자 페이지입니다.">
        
      </SidebarSection>

      <SidebarItem text="쿠폰 관리" href="/admin/coupons" />
      <SidebarItem text="카테고리 관리" href="/admin/category" />
      <SidebarItem text="도장 관리" href="/admin/seal" />
      <SidebarItem text="뱃지 관리" href="/admin/badges" />
      <SidebarItem text="체크리스트 관리" href="/admin/checklist" />
      <SidebarItem text="신고 관리" href="/admin/Complaint" />

    
      <Footer>
        <div style={{ cursor: 'pointer' }}>로그아웃</div>
      </Footer>
    </Wrapper>
  );
};

export default Sidebar;
