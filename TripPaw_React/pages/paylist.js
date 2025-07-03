import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from './style/PayList.module.css';
import ContentHeader from '../components/ContentHeader';
import { CloseOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

const PayList = () => {
  const router = useRouter(); 
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const stateMap = {
    PAID: '결제 완료',
    CANCELLED: '결제 취소',
    REFUNDED: '환불 완료',
    
  };

  const openDetailModal = (payment) => {
    setSelectedPayment(payment);
    setModalVisible(true);
  };

  const closeDetailModal = () => {
    setSelectedPayment(null);
    setModalVisible(false);
  };

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
    <>
    <ContentHeader theme="dark" />
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>결제 내역</h2>
          <CloseOutlined
            className={styles.closeIcon}
            onClick={() => router.push('/reservlist')}
            aria-label="예약 내역으로 이동"
          />
        </div>
      {payments.map((pay) => (
        <div key={pay.id} className={styles.receipt}>
        <div className={styles.receiptHeader}>
          <div className={styles.headerLeft}>
            <h2>{pay.reserv?.place?.name}</h2>
          </div>

          <div className={styles.headerRight}>
            <small>{new Date(pay.paidAt).toLocaleString()}</small>
            <button
              className={styles.detailBtn}
              onClick={() => openDetailModal(pay)}
            >
              상세 보기
            </button>
          </div>
        </div>
          <div className={styles.receiptBody}>
            <p><strong>결제 상태:</strong> {stateMap[pay.state] || pay.state}</p>
            <p><strong>결제 금액:</strong> {pay.amount.toLocaleString()}원</p>
            <p><strong>결제 수단:</strong> {pay.payMethod}</p>
          </div>
          <div className={styles.receiptFooter}>
            {pay.reserv?.state === 'CANCELLED' ? (
              <>
                {pay.state === 'PAID' && (
                  <button
                    onClick={() => cancelPayment(pay.id)}
                    className={styles.cancelBtn}
                  >
                    결제 취소
                  </button>
                )}
                {pay.state === 'CANCELLED' && (
                  <button
                    onClick={() => refundPayment(pay)}
                    className={styles.refund}
                  >
                    환불 처리
                  </button>
                )}
                {pay.state === 'REFUNDED' && (
                  <span className={styles.refundedBadge}>환불 완료</span>
                )}
              </>
            ) : (
              <span className={styles.infoText}>예약 취소 후 이용 가능</span>
            )}
          </div>
          <Modal
            title="결제 상세 내역"
            visible={modalVisible}
            onCancel={closeDetailModal}
            footer={null}
          >
            {selectedPayment && (
              <div>
                <p><strong>결제 ID:</strong> {selectedPayment.id}</p>
                <p><strong>예약 ID:</strong> {selectedPayment.reserv?.id || '-'}</p>
                <p><strong>결제 번호:</strong> {selectedPayment.impUid}</p>
                <p><strong>결제자:</strong> {selectedPayment.member?.username}</p>
                <p><strong>결제 상태:</strong> {stateMap[selectedPayment.state] || selectedPayment.state}</p>
                <p><strong>결제 금액:</strong> {selectedPayment.amount.toLocaleString()}원</p>
                <p><strong>결제 수단:</strong> {selectedPayment.payMethod}</p>
                <p><strong>PG사:</strong> {selectedPayment.pgProvider}</p>
                <p><strong>결제 시간:</strong> {new Date(selectedPayment.paidAt).toLocaleString()}</p>
              </div>
            )}
          </Modal>
        </div>
      ))}
    </div>
    </>
  );
};

export default PayList;
