import Link from 'next/link';
import axios from 'axios';
import { CheckCircleFilled } from '@ant-design/icons';

export async function getServerSideProps(context) {
  const { reservId, tripPlanId } = context.query;

  try {
    let reserv = null;
    let place = null;
    let pay = null;

    if (tripPlanId) {
      // 일괄 예약인 경우 (tripPlanId로 여러 예약 조회)
      const res = await axios.get(`http://localhost:8080/reserv/tripplan/${tripPlanId}`);
      reserv = res.data;  // 배열 예상

      // 장소 정보는 여러 예약에 따라 다를 수 있으니 필요하면 배열 내 첫 예약 장소로 처리
      place = (reserv.length > 0 && reserv[0].place) ? reserv[0].place : null;

      // 결제 정보도 여러 건일 수 있음
      const resPay = await axios.get(`http://localhost:8080/pay/tripplan/${tripPlanId}`);
      pay = resPay.data; // 배열 예상
    } else if (reservId) {
      // 단일 예약
      const res = await axios.get(`http://localhost:8080/reserv/${reservId}`);
      reserv = res.data;

      place = reserv.place ?? null;

      const resPay = await axios.get(`http://localhost:8080/pay/reserv/${reservId}`);
      pay = resPay.data;
    }

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
  const isBatch = Array.isArray(reserv);

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

      {isBatch ? (
        <>
          <h2>총 {reserv.length}건의 예약 내역</h2>
          <div
            style={{
              marginTop: 20,
              textAlign: 'left',
              border: '1px solid #eee',
              padding: 15,
              borderRadius: 8,
              backgroundColor: '#fafafa',
              fontSize: 16,
              lineHeight: 1.5,
              maxHeight: 400,
              overflowY: 'auto',
            }}
          >
            {reserv.map((r) => {
              const payItem = pay.find(p => p.reservId === r.id) ?? {};
              return (
                <div key={r.id} style={{ marginBottom: 15, borderBottom: '1px solid #ddd', paddingBottom: 10 }}>
                  <p><strong>예약 번호:</strong> {r.id}</p>
                  <p><strong>결제 금액:</strong> {payItem.amount ?? '-'}원</p>
                  <p><strong>예약 기간:</strong> {r.startDate} ~ {r.endDate}</p>
                  <p><strong>인원 수:</strong> {r.countPeople}명</p>
                  <p><strong>반려동물 수:</strong> {r.countPet}마리</p>
                  <p><strong>장소 이름:</strong> {r.place?.name ?? '-'}</p>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* 단일 예약 렌더링 */}
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
        </>
      )}

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
