import Link from 'next/link';
import axios from 'axios';
import { CheckCircleFilled } from '@ant-design/icons';

export async function getServerSideProps(context) {
  const { reservId } = context.query;

  try {

    const res = await axios.get(`http://localhost:8080/reserv/${reservId}`);
    const reserv = res.data;

    const place = reserv.place ?? null;

    const resPay = await axios.get(`http://localhost:8080/pay/reserv/${reservId}`);
    const pay = resPay.data;

    return {
      props: { reserv, place, pay }
    };
  } catch (error) {
    console.error(error);
    return {
      props: { reserv: null, place: null, pay: null }
    };
  }
}

export default function PaymentSuccessPage({ reserv, place, pay }) {
  return (
    <div
      style={{
        maxWidth: 600,
        margin: '80px auto',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        padding: 20,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        borderRadius: 12,
        backgroundColor: '#fff',
      }}
    >
      <CheckCircleFilled style={{ fontSize: '48px', color: '#4BB543', marginBottom: '16px' }} />
      <h1 style={{ color: '#4BB543' }}> 결제 성공! 감사합니다 </h1>
      <p style={{ fontSize: 18, marginTop: 20 }}>
        예약이 정상적으로 완료되었습니다.
      </p>

      {/* 결제 간단 정보 */}
      <div
        style={{
          marginTop: 30,
          textAlign: 'left',
          border: '1px solid #eee',
          padding: 15,
          borderRadius: 8,
          backgroundColor: '#fafafa',
          fontSize: 16,
          lineHeight: 1.5,
        }}
      >
        <p><strong>예약 번호:</strong> {reserv?.id ?? '-'}</p>
        <p><strong>결제 금액:</strong> {pay?.amount}원</p>
        <p><strong>예약 기간:</strong> {reserv?.startDate} ~ {reserv?.endDate}</p>
        <p><strong>인원 수:</strong> {reserv?.countPeople}명</p>
        <p><strong>반려동물 수:</strong> {reserv?.countPet}마리</p>
      </div>

      {/* 장소 정보 */}
      <div
        style={{
          marginTop: 30,
          textAlign: 'left',
          border: '1px solid #eee',
          padding: 15,
          borderRadius: 8,
          backgroundColor: '#fafafa',
        }}
      >
        <h2 style={{ marginTop: 0 }}>{place?.name ?? '장소 정보 없음'}</h2>
        <p style={{ margin: 0 }}>{place?.region ?? '-'}</p>
      </div>

      {/* 버튼 그룹 */}
      <div
        style={{
          marginTop: 40,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '300px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
        <Link
          href="/"
          style={{
            textDecoration: 'none',
            color: 'white',
            backgroundColor: '#0070f3',
            padding: '10px 20px',
            borderRadius: 5,
            fontWeight: 'bold',
            display: 'inline-block',
            width: 140,
            textAlign: 'center',
            whiteSpace: 'normal',
            wordBreak: 'keep-all',
            lineHeight: 1.2,
          }}
        >
          메인 페이지로<br />돌아가기
        </Link>

        <Link
          href="/reserv/reservlist"
          style={{
            textDecoration: 'none',
            color: 'white',
            backgroundColor: '#28a745',
            padding: '10px 20px',
            borderRadius: 5,
            fontWeight: 'bold',
            display: 'inline-block',
            width: 140,
            textAlign: 'center',
            whiteSpace: 'normal',
            wordBreak: 'keep-all',
            lineHeight: 1.2,
          }}
        >
          예약 내역<br />확인하기
        </Link>
        </div>
      </div>
    </div>
  );
}
