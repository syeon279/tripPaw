import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

function PaymentPage() {
  const router = useRouter();
  const {
    reservId,
    memberId,
    countPeople,
    countPet,
    startDate,
    endDate,
    amount,
  } = router.query;

  const [reservData, setReservData] = useState({
    reservId,
    memberId,
    countPeople,
    countPet,
    startDate,
    endDate,
    amount,
  });

  const [loading, setLoading] = useState(!reservId);
  const [error, setError] = useState(null);

  // PG사 선택 상태 (기본값: html5_inicis)
  const [selectedPg, setSelectedPg] = useState('html5_inicis');

  useEffect(() => {
    if (!reservId?.trim()) return;

    // 예약정보가 query에 없으면 API 호출
    if (!memberId || !countPeople || !countPet || !startDate || !endDate || !amount) {
      setLoading(true);
      axios.get(`http://localhost:8080/reserv/${reservId}`)
        .then(res => {
          const data = res.data;
          setReservData({
            reservId: data.id,
            memberId: data.member.id,
            countPeople: data.countPeople,
            countPet: data.countPet,
            startDate: data.startDate,
            endDate: data.endDate,
            amount: data.amount || 10000,
          });
          setLoading(false);
        })
        .catch(() => {
          setError('예약 정보를 불러오지 못했습니다.');
          setLoading(false);
        });
    }
  }, [reservId]);

  const loadIamportScript = () => {
    return new Promise((resolve, reject) => {
      if (window.IMP) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.iamport.kr/js/iamport.payment-1.2.0.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('iamport script load failed'));
      document.head.appendChild(script);
    });
  };

  const onClickPay = async () => {
    try {
      await loadIamportScript();
      const { IMP } = window;
      IMP.init('imp83864415'); // 가맹점 식별코드 변경

      IMP.request_pay(
        {
          pg: selectedPg,
          pay_method: 'card',
          name: '트립포우 예약 결제',
          amount: Number(reservData.amount),
          buyer_email: 'user@example.com',
          buyer_name: '홍길동',
          buyer_tel: '010-1234-5678',
        },
        async (rsp) => {
          if (rsp.success) {
            try {
              await axios.post('http://localhost:8080/pay/verify', null, {
                params: {
                  impUid: rsp.imp_uid,
                  merchantUid: rsp.merchant_uid,
                  reservId: reservData.reservId,
                  memberId: reservData.memberId,
                },
                withCredentials: true,
              });
              alert('결제가 완료되었습니다!');
              router.push('/some-success-page');
            } catch {
              alert('결제 검증 중 오류가 발생했습니다.');
            }
          } else {
            alert('결제 실패: ' + rsp.error_msg);
          }
        }
      );
    } catch (error) {
      alert('결제 스크립트 로드에 실패했습니다.');
      console.error(error);
    }
  };

  if (loading) return <p>예약 정보를 불러오는 중입니다...</p>;
  if (error) return <p>{error}</p>;
  if (!reservData.reservId) return <p>예약 정보가 없습니다. 예약 페이지로 이동해 주세요.</p>;

  return (
    <div>
      <h2>결제하기</h2>
      <p>예약 번호: {reservData.reservId}</p>
      <p>인원 수: {reservData.countPeople}명</p>
      <p>반려동물 수: {reservData.countPet}마리</p>
      <p>예약 기간: {reservData.startDate} ~ {reservData.endDate}</p>
      <p>결제 금액: {reservData.amount}원</p>

      <div>
        <h3>PG사 선택</h3>
        <label>
          <input
            type="radio"
            name="pg"
            value="html5_inicis"
            checked={selectedPg === 'html5_inicis'}
            onChange={(e) => setSelectedPg(e.target.value)}
          />
          KG이니시스
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="pg"
            value="kakaopay.TC0ONETIME"
            checked={selectedPg === 'kakaopay.TC0ONETIME'}
            onChange={(e) => setSelectedPg(e.target.value)}
          />
          카카오페이
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="pg"
            value="tosspay.tosstest"
            checked={selectedPg === 'tosspay.tosstest'}
            onChange={(e) => setSelectedPg(e.target.value)}
          />
          토스페이
        </label>
      </div>

      <button onClick={onClickPay}>결제하기</button>
    </div>
  );
}

export default PaymentPage;
