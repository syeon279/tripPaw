import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { Dropdown, Menu, Button, message, Modal } from 'antd';
import { UserOutlined, NotificationOutlined, SearchOutlined, MenuOutlined } from '@ant-design/icons';
import Image from 'next/image';
import axios from 'axios';


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

const LogoWrapper = styled.div`
  cursor: pointer;
`;

const ContentHeader = ({ theme }) => {
  const isWhite = theme === 'white';
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
        if (response.status === 200) {
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
  const onLogout = async () => {
    await axios.post('http://localhost:8080/api/auth/logout', {
      withCredentials: true,
    })
    setIsLoggedIn(false);
    router.push("/");
  }

  return (
    <HeaderWrapper>
      <LogoWrapper onClick={() => router.push('/')}>
        {isWhite ?
          <Image src="/image/logo/TripPaw-logo-white.png" alt="logo" width={160} height={40} />
          :
          <Image src="/image/logo/TripPaw-logo.png" alt="logo" width={160} height={40} />
        }
      </LogoWrapper>

      <IconMenu isWhite={isWhite} >
        {/* <NotificationOutlined
          onClick={() => router.push('/notice')}
          style={{ color: isWhite ? 'white' : 'black' }}
        />
        <SearchOutlined
          onClick={() => router.push('/search')}
          style={{ color: isWhite ? 'white' : 'black' }}
        /> */}
        {isLoggedIn ? <div style={{ display: "flex" }}>
          <UserOutlined
            onClick={() => router.push('/mypage/trips')}
            style={{ marginRight: '25px', color: isWhite ? 'white' : 'black' }}
          />
          <div>
            <span onClick={onLogout}>로그아웃</span>
          </div>
        </div>
          : <UserOutlined
            onClick={() => router.push('/member/login')}
            style={{ marginRight: '25px', color: isWhite ? 'white' : 'black' }}
          />}
        <div>
          <MenuOutlined
            onClick={() => router.push('/menu')}
            style={{ color: isWhite ? 'white' : 'black' }} />
        </div>
      </IconMenu>
    </HeaderWrapper>

  );
};

export default ContentHeader;