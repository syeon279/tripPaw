import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { Dropdown, Menu, Button, message, Modal } from 'antd';
import { UserOutlined, NotificationOutlined, SearchOutlined } from '@ant-design/icons';
import Image from 'next/image';

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  width: 100%;
  box-sizing: border-box;
`;


const menuItems = [
  { key: 'notice', label: '', icon: <NotificationOutlined />, path: '/notice' },
  { key: 'mypage', label: '', icon: <UserOutlined />, path: '/chat' },
  { key: 'detailMenu', label: '', icon: <SearchOutlined />, path: '/search' },
];

const ContentHeader = () => {



  return (
    <HeaderWrapper>
      <Image src="/image/logo/TripPaw-logo.png" alt="logo" width={50} height={10} />
    </HeaderWrapper>

  );
};

export default ContentHeader;