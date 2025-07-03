import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { Dropdown, Menu, Button, message, Modal } from 'antd';
import { UserOutlined, NotificationOutlined, SearchOutlined } from '@ant-design/icons';
import Image from 'next/image';
import axios from 'axios';

const HeaderWrapper = styled.div`
  position: fixed;              // ✅ 고정
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;                // ✅ 겹치게
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0);  // ✅ 반투명
  //backdrop-filter: blur(8px);           // ✅ 흐림 효과 (선택)
  //border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
`;


const IconMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 16px; // 아이콘 사이 간격
  color: #333;
   color: white;
  font-size: 20px;
  cursor: pointer;
`;

const ContentHeader = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
     useEffect(() => {
      const checkLoginStatus = async () => {
        try {
          // 1. 서버에 인증 상태 확인 API 요청
          const response = await axios.get('http://localhost:8080/api/auth/check', {
            withCredentials: true,
          });
           // 2. API 호출 성공 시, 로그인 상태를 true로 변경
        if(response.status === 200) {
          setIsLoggedIn(true);
        }
          //console.log("response=",response.data);
          // 4. 서버로부터 받은 사용자 정보로 로그인 상태 업데이트
           //login(response.data); 
        } catch (error) {
          // 5. 에러 발생 시(주로 401), 로그아웃 상태로 처리
          // logout();
          console.log("로그인 상태가 아닙니다.");
        }
      };

      checkLoginStatus();
    }, []); // []를 사용하여 앱 시작 시 한 번만 실행


  return (
    <HeaderWrapper>
      <Image src="/image/logo/TripPaw-logo-white.png" alt="logo" width={140} height={40} />

      <IconMenu>
        <NotificationOutlined onClick={() => router.push('/notice')} />
        <SearchOutlined onClick={() => router.push('/search')} />
        {isLoggedIn ? <UserOutlined onClick={() => router.push('/member/main')} />
                    : <UserOutlined onClick={() => router.push('/member/login')} /> }
      </IconMenu>
    </HeaderWrapper>

  );
};

export default ContentHeader;