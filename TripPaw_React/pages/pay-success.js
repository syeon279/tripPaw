import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#4BB543' }}>🎉 결제 성공! 감사합니다 🎉</h1>
      <p style={{ fontSize: 18, marginTop: 20 }}>
        예약 결제가 정상적으로 완료되었습니다.
      </p>
      <p style={{ marginTop: 30 }}>
        <Link
          href="/"
          style={{
            textDecoration: 'none',
            color: 'white',
            backgroundColor: '#0070f3',
            padding: '10px 20px',
            borderRadius: 5,
            fontWeight: 'bold',
            display: 'inline-block'
          }}
        >
          메인 페이지로 돌아가기
        </Link>
      </p>
    </div>
  );
}
