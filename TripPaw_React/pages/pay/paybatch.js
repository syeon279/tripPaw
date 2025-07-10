import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 480px;
  margin: 40px auto;
  padding: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #222;
  text-align: center;
  margin-bottom: 24px;
`;

const PayList = styled.ul`
  padding-left: 0;
  list-style: none;
  margin-bottom: 20px;
`;

const PayItem = styled.li`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 12px;
  background-color: #f9f9f9;
`;

const PayInfo = styled.p`
  margin: 4px 0;
  font-size: 15px;
  & > strong {
    color: #444;
  }
`;

const TotalAmount = styled.p`
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  margin: 24px 0 16px;
`;

const PgSelectContainer = styled.div`
  margin: 16px 0 24px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 16px;
  cursor: pointer;
  user-select: none;

  input[type='radio'] {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #ccc;
    border-radius: 50%;
    margin-right: 12px;
    position: relative;
    cursor: pointer;
    transition: border-color 0.3s ease;
  }
  input[type='radio']:checked {
    border-color: #0070f3;
    background-color: #0070f3;
  }
  input[type='radio']:checked::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
  }
`;

const PayButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #0070f3;
  color: white;
  font-size: 18px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.25s ease;

  &:hover {
    background-color: #005bb5;
  }
  &:active {
    background-color: #004494;
  }
`;

const PlaceList = styled.ul`
  padding-left: 0;
  list-style: none;
  margin-bottom: 24px;
`;

const PlaceItem = styled.li`
  font-size: 16px;
  margin-bottom: 6px;
  color: #555;
`;

function PayBatchPage() {
  const router = useRouter();
  const { memberTripPlanId } = router.query;

  const [totalAmount, setTotalAmount] = useState(0);
  const [reservList, setReservList] = useState([]);
  const [payList, setPayList] = useState([]);
  const [selectedPg, setSelectedPg] = useState('html5_inicis');
  const [placeSummaryList, setPlaceSummaryList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/auth/check', {
                    withCredentials: true,
                });

                if (response.status === 200) {
                    setIsLoggedIn(true);
                    setUserId(response.data.id);
                    setUserName(response.data.username);
                }
            } catch (error) {
                console.error("로그인 상태 확인 실패:", error);
                alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
                router.push('/member/login');
            }
        };

        checkLoginStatus();
    },[])

  useEffect(() => {
    if (!memberTripPlanId || !userId) return;

    console.log('📦 API 요청 준비:', memberTripPlanId, userId);

    axios.get(`http://localhost:8080/pay/batch/${memberTripPlanId}?userId=${userId}`, {
      withCredentials: true,
    })
    .then(res => {
      console.log('✅ API 응답 성공:', res.data);

      setTotalAmount(res.data.totalAmount);

      if (res.data.payList) {
        console.log('payList 있음:', res.data.payList);
        setPayList(res.data.payList);
        setPlaceSummaryList(createPlaceSummary(res.data.payList));
        setReservList([]);
      } else if (res.data.reservList) {
        console.log('reservList 있음:', res.data.reservList);
        console.log('reservList 길이:', res.data.reservList.length);
        setPayList([]);
        setReservList(res.data.reservList);
        setPlaceSummaryList(createPlaceSummaryFromReserv(res.data.reservList));
      } else {
        console.log('payList, reservList 모두 없음');
        setPayList([]);
        setReservList([]);
        setPlaceSummaryList([]);
      }
    })
    .catch(() => {
      alert('일괄 결제 정보 불러오기 실패');
    });
  }, [memberTripPlanId, userId]);

  // 장소별 요약 생성 함수 (payList 기준)
  const createPlaceSummary = (payList) => {
    const summaryMap = {};
    payList.forEach(pay => {
      const placeName = pay.reserv?.place?.name || '이름 없음';
      if (!summaryMap[placeName]) {
        summaryMap[placeName] = { count: 0, total: 0 };
      }
      summaryMap[placeName].count += 1;
      summaryMap[placeName].total += pay.amount;
    });
    return Object.entries(summaryMap).map(([placeName, info]) => ({
      placeName,
      count: info.count,
      total: info.total,
    }));
  };

  // 장소별 요약 생성 함수 (reservList 기준)
  const createPlaceSummaryFromReserv = (reservList) => {
    const summaryMap = {};
    reservList.forEach(reserv => {
      const placeName = reserv.place?.name || '이름 없음';
      if (!summaryMap[placeName]) {
        summaryMap[placeName] = { count: 0, total: 0 };
      }
      summaryMap[placeName].count += 1;
      summaryMap[placeName].total += reserv.finalPrice || 0;
    });
    return Object.entries(summaryMap).map(([placeName, info]) => ({
      placeName,
      count: info.count,
      total: info.total,
    }));
  };

  const loadIamportScript = () => {
    return new Promise((resolve, reject) => {
      if (window.IMP) return resolve();
      const script = document.createElement('script');
      script.src = 'https://cdn.iamport.kr/js/iamport.payment-1.2.0.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const onClickPay = async () => {
    await loadIamportScript();
    const { IMP } = window;
    IMP.init('imp83864415');

    IMP.request_pay(
      {
        pg: selectedPg,
        pay_method: 'card',
        name: '트립플랜 일괄결제',
        amount: totalAmount,
        buyer_email: 'user@example.com',
        buyer_name: '홍길동',
        buyer_tel: '010-1234-5678',
      },
      async (rsp) => {
        if (rsp.success) {
          try {
            await axios.post(`http://localhost:8080/pay/batch/${memberTripPlanId}/verify`, 
            { impUid: rsp.imp_uid }, 
            { withCredentials: true });

            alert('일괄 결제가 완료되었습니다!');
            router.push({
              pathname:'/pay/paygroup-success',
              query: { memberTripPlanId: memberTripPlanId }
            });
          } catch (err) {
            alert('검증 중 오류가 발생했습니다.');
          }
        } else {
          alert('결제 실패: ' + rsp.error_msg);
        }
      }
    );
  };

  return (
    <Container>
      <Title>일괄 결제</Title>

      <PayList>
        {payList.length > 0 ? (
          <>
            {payList.map((pay, idx) => (
              <PayItem key={idx}>
                <PayInfo><strong>숙소:</strong> {pay.placeName || '이름 없음'}</PayInfo>
                <PayInfo><strong>기간:</strong> {pay.startDate} ~ {pay.endDate}</PayInfo>
                <PayInfo><strong>금액:</strong> {pay.amount.toLocaleString()}원</PayInfo>
              </PayItem>
            ))}
            <TotalAmount>
              총 금액: {payList.reduce((total, pay) => total + (pay.amount || 0), 0).toLocaleString()}원
            </TotalAmount>
          </>
        ) : reservList.length > 0 ? (
          <>
            {reservList.map((reserv, idx) => (
              <PayItem key={idx}>
                <PayInfo><strong>숙소:</strong> {reserv.place?.name || '이름 없음'}</PayInfo>
                <PayInfo><strong>기간:</strong> {reserv.startDate} ~ {reserv.endDate}</PayInfo>
                <PayInfo><strong>금액:</strong> {reserv.finalPrice.toLocaleString()}원</PayInfo>
              </PayItem>
            ))}
            <TotalAmount>
              총 금액: {reservList.reduce((total, reserv) => total + (reserv.finalPrice || 0), 0).toLocaleString()}원
            </TotalAmount>
          </>
        ) : (
          <p>예약된 장소가 없습니다.</p>
        )}
      </PayList>

      <PgSelectContainer>
        <RadioLabel>
          <input
            type="radio"
            name="pg"
            value="html5_inicis"
            checked={selectedPg === 'html5_inicis'}
            onChange={(e) => setSelectedPg(e.target.value)}
          />
          카드결제
        </RadioLabel>
        <RadioLabel>
          <input
            type="radio"
            name="pg"
            value="kakaopay.TC0ONETIME"
            checked={selectedPg === 'kakaopay.TC0ONETIME'}
            onChange={(e) => setSelectedPg(e.target.value)}
          />
          카카오페이
        </RadioLabel>
        <RadioLabel>
          <input
            type="radio"
            name="pg"
            value="tosspay.tosstest"
            checked={selectedPg === 'tosspay.tosstest'}
            onChange={(e) => setSelectedPg(e.target.value)}
          />
          토스페이
        </RadioLabel>
      </PgSelectContainer>

      <PayButton onClick={onClickPay}>일괄 결제하기</PayButton>
    </Container>
  );
}

export default PayBatchPage;
