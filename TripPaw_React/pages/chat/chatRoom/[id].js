import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styled from 'styled-components';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// --- 1. 스타일 컴포넌트 정의 ---
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  font-family: Arial, sans-serif;
`;

const UsernamePageContainer = styled.div`
  text-align: center;
  background: white;
  padding: 50px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
`;

const ChatContainer = styled.div`
  width: 100%;
  max-width: 800px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
`;

const ChatHeader = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #ddd;
  background-color: #f7f7f7;
  h2 {
    margin: 0;
    font-size: 1.2em;
  }
`;

const MessageArea = styled.ul`
  flex-grow: 1;
  list-style-type: none;
  padding: 20px;
  overflow-y: auto;
`;

const MessageItem = styled.li`
  /* ... (이전 답변의 MessageItem 스타일과 동일) ... */
`;

const ChatForm = styled.form`
  /* ... (이전 답변의 ChatForm 스타일과 동일) ... */
`;

const Connecting = styled.div`
  padding: 15px 20px;
  text-align: center;
  color: #888;
`;

// --- 2. 헬퍼 함수 및 메인 컴포넌트 ---
const colors = ['#2196F3', '#32c787', '#00BCD4', '#ff5652', '#ffc107', '#ff85af', '#FF9800', '#39bbb0'];
const getAvatarColor = (sender) => {
    let hash = 0;
    for (let i = 0; i < sender.length; i++) {
        hash = 31 * hash + sender.charCodeAt(i);
    }
    return colors[Math.abs(hash % colors.length)];
};

function ChatRoom() {
  const router = useRouter();
  const { id: roomId } = router.query;

  const [roomTitle, setRoomTitle] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  const stompClientRef = useRef(null);
  const messageAreaRef = useRef(null);

  // 컴포넌트 마운트 및 roomId 변경 시 실행
  useEffect(() => {
    if (!roomId) return;

    // 채팅방 정보(제목 등)를 가져오는 API 호출
    const fetchRoomInfo = async () => {
        try {
            // 이 API는 직접 만드셔야 합니다. (이전 답변 참고)
            const response = await axios.get(`/api/chat/room/${roomId}`);
            setRoomTitle(response.data.title);
        } catch (error) {
            console.error("Room info fetch error", error);
            alert("존재하지 않는 채팅방입니다.");
            router.push('/chat/rooms'); // 목록으로 리다이렉트
        }
    };
    fetchRoomInfo();

    // 웹소켓 연결 해제 로직
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [roomId, router]);

  // 메시지 목록 변경 시 스크롤
  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleConnect = (event) => {
    event.preventDefault();
    if (!username.trim() || !roomId) return;
    
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'), // 백엔드 주소 명시
      onConnect: () => {
        client.subscribe(`/topic/chat/${roomId}`, (payload) => {
          const message = JSON.parse(payload.body);
          setMessages(prev => [...prev, message]);
        });
        client.publish({
          destination: `/app/chat/${roomId}/addUser`,
          body: JSON.stringify({ sender: username, type: 'JOIN', roomId }),
        });
        setIsConnected(true);
      },
    });

    client.activate();
    stompClientRef.current = client;
  };
  
  const handleSendMessage = (event) => {
    event.preventDefault();
    const messageContent = newMessage.trim();

    if (messageContent && stompClientRef.current) {
      stompClientRef.current.publish({
        destination: `/app/chat/${roomId}/sendMessage`,
        body: JSON.stringify({ sender: username, content: messageContent, type: 'CHAT', roomId }),
      });
      setNewMessage('');
    }
  };

  // roomId가 아직 로드되지 않았을 때 로딩 상태 표시
  if (!roomId || !roomTitle) {
      return <PageContainer><div>로딩 중...</div></PageContainer>;
  }

  return (
    <PageContainer>
      {!isConnected ? (
        <UsernamePageContainer>
          <h1>'{roomTitle}' 입장</h1>
          <form onSubmit={handleConnect}>
            <div className="form-group">
              <input 
                type="text" 
                placeholder="닉네임을 입력하세요" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="form-group mt-3">
              <button type="submit" className="btn btn-primary w-100">입장하기</button>
            </div>
          </form>
        </UsernamePageContainer>
      ) : (
        <ChatContainer>
          <ChatHeader><h2>{roomTitle}</h2></ChatHeader>
          <MessageArea ref={messageAreaRef}>
            {/* ... 메시지 렌더링 로직 (이전 답변과 동일) ... */}
          </MessageArea>
          <ChatForm onSubmit={handleSendMessage}>
            {/* ... 메시지 입력 폼 (이전 답변과 동일) ... */}
          </ChatForm>
        </ChatContainer>
      )}
    </PageContainer>
  );
}

export default ChatRoom;