import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { useRouter } from 'next/router';

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #ddd;
  padding-bottom: 0.5rem;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th, td {
    padding: 12px 16px;
    border-bottom: 1px solid #eee;
  }

  th {
    background-color: #f9f9f9;
    font-weight: 600;
    color: #444;
  }

  tr:hover {
    background-color: #f5f7fa;
  }
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  background-color: ${({ state }) =>
    state === 'WAITING' ? '#facc15' :
    state === 'CANCELLED' ? '#f87171' :
    '#34d399'};
  color: #fff;
  font-weight: bold;
`;

const Button = styled.button`
  background-color: ${({ danger }) => (danger ? '#e11d48' : '#2563eb')};
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};

  &:hover {
    opacity: 0.9;
  }
`;

const Footer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 100;
`;

const BottomButton = styled.button`
  background: linear-gradient(135deg, #4f46e5, #3b82f6);
  color: white;
  padding: 12px 28px;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.1rem;
  min-width: 150px;
  height: 48px;
  box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #3b82f6, #4f46e5);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.6);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
  }

  @media (max-width: 480px) {
    min-width: 120px;
    padding: 10px 20px;
    font-size: 1rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
`;

const MutedText = styled.span`
  color: #888;
  font-style: italic;
`;

const Message = styled.p`
  text-align: center;
  margin-top: 80px;
  color: #666;
`;

const Error = styled(Message)`
  color: #e11d48;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.2s ease-out forwards;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  animation: ${fadeIn} 0.2s ease-out forwards;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #111;
`;

const ModalContent = styled.div`
  color: #444;
  line-height: 1.6;
  margin-bottom: 20px;

  p {
    margin: 0.5rem 0;
  }
`;

const ReservList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReserv, setSelectedReserv] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('http://localhost:8080/reserv', {
          withCredentials: true,
        });
        setReservations(response.data);
      } catch (err) {
        setError('예약 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const cancelReserv = async (reservId) => {
    if (!confirm('정말 예약을 취소하시겠습니까?')) return;

    try {
      await axios.post(`http://localhost:8080/reserv/${reservId}/delete`, null, {
        withCredentials: true,
      });
      alert('예약이 취소되었습니다.');
      setReservations((prev) =>
        prev.map((r) => (r.id === reservId ? { ...r, state: 'CANCELLED' } : r))
      );
    } catch (err) {
      alert('예약 취소에 실패했습니다.');
    }
  };

  const viewReservDetail = (reserv) => {
    setSelectedReserv(reserv);
    setIsDetailModalOpen(true);
  };

  const goToPayPage = (reserv) => {
    const query = new URLSearchParams({
      reservId: reserv.id,
      memberId: reserv.member?.id || '',
      countPeople: reserv.countPeople?.toString() || '1',
      countPet: reserv.countPet?.toString() || '0',
      startDate: reserv.startDate,
      endDate: reserv.endDate,
      amount: (reserv.amount || 10000).toString(),
    }).toString();

    router.push(`/pay?${query}`);
  };

  const closeDetailModal = () => {
    setSelectedReserv(null);
    setIsDetailModalOpen(false);
  };

    const cancelReservInModal = async (reservId) => {
    if (!window.confirm('정말 예약을 취소하시겠습니까?')) return;

    try {
      await axios.post(`http://localhost:8080/reserv/${reservId}/delete`, null, {
        withCredentials: true,
      });
      alert('예약이 취소되었습니다.');
      setReservations((prev) =>
        prev.map((r) => (r.id === reservId ? { ...r, state: 'CANCELLED' } : r))
      );
      closeDetailModal(); // 모달 닫기
    } catch (err) {
      alert('예약 취소에 실패했습니다.');
    }
  };


  if (loading) return <Message>불러오는 중...</Message>;
  if (error) return <Error>{error}</Error>;
  if (reservations.length === 0) return <Message>예약 내역이 없습니다.</Message>;

  return (
    <Wrapper>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <Title>예약 내역</Title>
      </div>
      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              {['예약 ID', '사용자 ID', '장소 ID', '시작일', '종료일', '상태', '액션'].map((title) => (
                <th key={title}>{title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reservations.map((reserv) => (
              <tr key={reserv.id}>
                <td>{reserv.id}</td>
                <td>{reserv.member?.id}</td>
                <td>{reserv.place?.id}</td>
                <td>{reserv.startDate}</td>
                <td>{reserv.endDate}</td>
                <td>
                  <StatusBadge state={reserv.state}>{reserv.state}</StatusBadge>
                </td>
                <td style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {reserv.state === 'WAITING' ? (
                    <>
                      <Button danger onClick={() => cancelReserv(reserv.id)}>예약 취소</Button>
                      <Button onClick={() => goToPayPage(reserv)}>결제하기</Button>
                    </>
                  ) : reserv.state !== 'CANCELLED' ? (
                    <>
                      <Button onClick={() => viewReservDetail(reserv)}>상세보기</Button>
                    </>
                  ) : (
                    <MutedText>취소됨</MutedText>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableWrapper>

      {isDetailModalOpen && selectedReserv && (
        <ModalOverlay onClick={closeDetailModal}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>예약 상세 정보</ModalTitle>
            <ModalContent>
              <p><strong>예약 ID:</strong> {selectedReserv.id}</p>
              <p><strong>사용자 ID:</strong> {selectedReserv.member?.id}</p>
              <p><strong>장소 ID:</strong> {selectedReserv.place?.id}</p>
              <p><strong>시작일:</strong> {selectedReserv.startDate}</p>
              <p><strong>종료일:</strong> {selectedReserv.endDate}</p>
              <p><strong>사람 수:</strong> {selectedReserv.countPeople}</p>
              <p><strong>반려동물 수:</strong> {selectedReserv.countPet}</p>
              <p><strong>상태:</strong> {selectedReserv.state}</p>
            </ModalContent>

            {selectedReserv.state === 'CONFIRMED' && (
              <Button danger fullWidth onClick={() => cancelReservInModal(selectedReserv.id)}>
                예약 취소
              </Button>
            )}

            <Button fullWidth onClick={closeDetailModal} style={{ marginTop: '8px' }}>
              닫기
            </Button>
          </Modal>
        </ModalOverlay>
      )}
      <Footer>
        <BottomButton onClick={() => router.push('/')}>홈으로</BottomButton>
        <BottomButton onClick={() => router.push('/paylist')}>결제 내역 보기</BottomButton>
      </Footer>
    </Wrapper>
  );
};

export default ReservList;
