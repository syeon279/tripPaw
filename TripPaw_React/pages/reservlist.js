import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'; 

const ReservList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const goToPayment = (reservId) => {
    router.push(`/pay/${reservId}`); 
  };

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p>{error}</p>;
  if (reservations.length === 0) return <p>예약 내역이 없습니다.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">예약 내역</h1>
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">예약 ID</th>
            <th className="border p-2">사용자 ID</th>
            <th className="border p-2">장소 ID</th>
            <th className="border p-2">시작일</th>
            <th className="border p-2">종료일</th>
            <th className="border p-2">상태</th>
            <th className="border p-2">결제</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reserv) => (
            <tr key={reserv.id} className="hover:bg-gray-50">
              <td className="border p-2">{reserv.id}</td>
              <td className="border p-2">{reserv.member?.id}</td>
              <td className="border p-2">{reserv.place?.id}</td>
              <td className="border p-2">{reserv.startDate}</td>
              <td className="border p-2">{reserv.endDate}</td>
              <td className="border p-2">{reserv.state}</td>
              <td className="border p-2">
                {reserv.state === 'WAITING' ? (
                  <button
                    onClick={() => goToPayment(reserv.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    결제하기
                  </button>
                ) : (
                  <span className="text-gray-400">완료</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservList;
