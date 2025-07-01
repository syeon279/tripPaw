import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function PayDetailPage() {
  const router = useRouter();
  const { id } = router.query;  // 여기서 id = 5가 됨

  const [payData, setPayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    axios.get(`http://localhost:8080/pay/${id}`)
      .then(res => {
        setPayData(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('결제 정보를 불러오지 못했습니다.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>결제 정보를 불러오는 중입니다...</p>;
  if (error) return <p>{error}</p>;
  if (!payData) return <p>결제 정보가 없습니다.</p>;

  return (
    <div>
      <h1>결제 상세 정보</h1>
      <p>결제 ID: {payData.id}</p>
      <p>예약 ID: {payData.reserv?.id}</p>
      <p>결제 금액: {payData.amount}원</p>
      <p>결제 상태: {payData.state}</p>
      {/* 추가 정보 표시 */}
    </div>
  );
}
