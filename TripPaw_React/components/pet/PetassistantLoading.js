import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import petImg from './petimg/petaiimg.png';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const waggleRotate = keyframes`
  0%, 100% { transform: translateX(0) rotate(0deg); }
  50% { transform: translateX(6px) rotate(5deg); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.6); // ✅ 흐림 정도 조절
  z-index: 998; // Wrapper보다 낮아야 함
`;

const PetAssistantWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 40%;
  transform: translate(-50%, -50%);
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${({ animate }) =>
    animate ? css`${fadeInUp} 0.6s ease forwards` : 'none'};
  gap: 12px;  // 너무 벌어지면 중앙 안 맞아보일 수 있어서 살짝 줄임
  backgroundColor: rgba(250, 250, 250, 0.63);
`;

const SpeechBubble = styled.div`
  background: #2a2a2a;
  border-radius: 16px;
  padding: 14px 20px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.6);
  font-size: 1.1rem;
  max-width: 400px;     // ✅ 최대 너비 설정
  min-width: 200px;     // ✅ 최소 너비 설정 (필수)
  width: fit-content;   // ✅ 내용에 따라 자동 너비
  line-height: 1.5;
  position: relative;
  color: #ddd;
  font-weight: 600;
  font-family: 'Nunito', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  user-select: none;
  letter-spacing: 0.02em;
  text-align: center;   // ✅ 가운데 정렬

  &::after {
    content: '';
    position: absolute;
    bottom: -14px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-top: 14px solid #2a2a2a;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
  }
`;
const PetImage = styled.img`
  width: 300px;
  height: auto;
  filter: drop-shadow(2px 3px 6px rgba(164, 90, 42, 0.3));
  user-select: none;
  animation: ${waggleRotate} 2s ease-in-out infinite;
  transition: transform 0.3s ease;

  &:hover {
    animation: none;
    transform: translateY(-5px) scale(1.08) rotate(3deg);
  }
`;

const messagesByState = {
  DEFAULT: '잠시만 기다려주개!',
};

const PetassistantLoading = ({ reservState }) => {
  const [message, setMessage] = useState(messagesByState.DEFAULT);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => {
      setMessage(messagesByState[reservState] || messagesByState.DEFAULT);
      setAnimate(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [reservState]);

  return (
    <>
      <Overlay />
      <PetAssistantWrapper animate={animate}>
        <SpeechBubble style={{ marginBottom: '20px' }}>{message}</SpeechBubble>
        <PetImage src={petImg.src} alt="AI 펫 캐릭터" />
      </PetAssistantWrapper>
    </>
  );
};

export default PetassistantLoading;
