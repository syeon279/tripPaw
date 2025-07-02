import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { Dropdown, Menu, Button, message, Modal } from 'antd';
import { UserOutlined, NotificationOutlined, SearchOutlined } from '@ant-design/icons';
import Image from 'next/image';

const HeaderWrapper = styled.div`
  position: fixed;              
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;                
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0);  
  //backdrop-filter: blur(8px);           
  //border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 20px;
  marginRight:10px;
`;


const IconMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 25px; // 아이콘 사이 간격
  color: #333;
   color: white;
  font-size: 20px;
  cursor: pointer;
`;

const ContentHeader = () => {
  const router = useRouter();


  return (
    <HeaderWrapper>
      <Image src="/image/logo/TripPaw-logo-white.png" alt="logo" width={160} height={40} />

      <IconMenu>
        <NotificationOutlined onClick={() => router.push('/notice')} />
        <SearchOutlined onClick={() => router.push('/search')} />
        <UserOutlined onClick={() => router.push('/mypage')} style={{ marginRight: '25px' }} />
      </IconMenu>
    </HeaderWrapper>

  );
};

export default ContentHeader;