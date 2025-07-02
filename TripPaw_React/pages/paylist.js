import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from './style/PayList.module.css';  // 경로는 환경에 맞게 조정

const PayList = () => {
  const router = useRouter(); 
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:8080/pay', {
          withCredentials: true,
        });
        setPayments(response.data);
      } catch (err) {
        setError('결제 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const cancelPayment = async (payId) => {
    if (!confirm('결제를 취소하시겠습니까?')) return;
    try {
      await axios.post(`http://localhost:8080/pay/${payId}/cancel`, null, {
        withCredentials: true,
      });
      alert('결제가 취소되었습니다.');
      setPayments((prev) =>
        prev.map((p) =>
          p.id === payId ? { ...p, state: 'CANCELLED' } : p
        )
      );
    } catch (err) {
      alert('결제 취소에 실패했습니다.');
    }
  };

  // 환불 요청 함수
  const refundPayment = async (pay) => {
    if (!window.confirm('정말 환불하시겠습니까?')) return;

    try {
      await axios.post(`http://localhost:8080/pay/${pay.impUid}/refund`, null, {
        withCredentials: true,
      });

      alert('환불이 완료되었습니다.');

      setPayments((prev) =>
        prev.map((p) =>
          p.id === pay.id ? { ...p, state: 'REFUNDED' } : p
        )
      );
    } catch (error) {
      alert('환불 처리에 실패했습니다.');
      console.error(error);
    }
  };

  if (loading) return <p className={styles.loading}>불러오는 중...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (payments.length === 0) return <p className={styles.empty}>결제 내역이 없습니다.</p>;

  return (
    <div className={styles.container}>

      <button
        className={styles.closeButton}
        onClick={() => router.push('/reservlist')}
        aria-label="닫기"
        type="button"
      >
        ×
      </button>

      <h1 className={styles.title}>결제 내역</h1>
      {payments.map((pay) => (
        <div key={pay.id} className={styles.receipt}>
          <div className={styles.receiptHeader}>
            <h2>{pay.reserv?.place?.name}</h2>
            <small>{new Date(pay.paidAt).toLocaleString()}</small>
          </div>
          <div className={styles.receiptBody}>
            <p><strong>결제 ID:</strong> {pay.id}</p>
            <p><strong>예약 ID:</strong> {pay.reserv?.id || '-'}</p>
            <p><strong>결제 상태:</strong> {pay.state}</p>
            <p><strong>결제 금액:</strong> {pay.amount.toLocaleString()}원</p>
            <p><strong>결제 수단:</strong> {pay.payMethod}</p>
            <p><strong>PG사:</strong> {pay.pgProvider}</p>
            <p><strong>아임포트 UID:</strong> {pay.impUid}</p>
          </div>
<div className={styles.receiptFooter}>
  {pay.reserv?.state === 'CANCELLED' ? (
    <>
      {pay.state === 'PAID' && (
        <button onClick={() => cancelPayment(pay.id)}>결제 취소</button>
      )}
      {pay.state === 'CANCELLED' && (
        <button
          onClick={() => refundPayment(pay)}
          className={styles.refund}
        >
          환불 처리
        </button>
      )}
      {pay.state === 'REFUNDED' && <span>환불 완료</span>}
    </>
  ) : (
    <span>예약 취소 후 이용 가능</span>
  )}
</div>
        </div>
      ))}
    </div>
  );
};

export default PayList;
