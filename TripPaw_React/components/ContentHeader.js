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
  font-size: 20px;
  cursor: pointer;
  color: ${(props) => (props.isWhite ? 'white' : 'black')};
`;

const ContentHeader = ({ theme }) => {
  const isWhite = theme === 'white';
  const router = useRouter();


  return (
    <HeaderWrapper>
      {isWhite ?
        <Image src="/image/logo/TripPaw-logo-white.png" alt="logo" width={160} height={40} />
        :
        <Image src="/image/logo/TripPaw-logo.png" alt="logo" width={160} height={40} />
      }

      <IconMenu isWhite={isWhite} >
        <NotificationOutlined
          onClick={() => router.push('/notice')}
          style={{ color: isWhite ? 'white' : 'black' }}
        />
        <SearchOutlined
          onClick={() => router.push('/search')}
          style={{ color: isWhite ? 'white' : 'black' }}
        />
        <UserOutlined
          onClick={() => router.push('/mypage')}
          style={{ marginRight: '25px', color: isWhite ? 'white' : 'black' }}
        />
      </IconMenu>
    </HeaderWrapper>

  );
};

export default ContentHeader;