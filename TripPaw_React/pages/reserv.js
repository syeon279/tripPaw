import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format, addDays, eachDayOfInterval, parseISO } from 'date-fns';

function ReservCreatePage() {
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection'
    }
  ]);
  const [disabledDates, setDisabledDates] = useState([]);
  const [countPeople, setCountPeople] = useState(1);
  const [countPet, setCountPet] = useState(0);
  const [memberId, setMemberId] = useState(1);
  const [placeId, setPlaceId] = useState(1);
  const [tripPlanId, setTripPlanId] = useState(null);
  const [message, setMessage] = useState('');

  const place = {
    name: "강원도 평창 오대산 국립공원",
    description: "아름다운 자연 경관과 등산로가 유명한 강원도 평창의 대표적인 산림 공원입니다.",
    imageUrl: "https://cdn.pixabay.com/photo/2015/10/12/15/45/mountains-984431_1280.jpg"
  };

  // ❗ 예약 불가 날짜 불러오기
  useEffect(() => {
    axios.get('http://localhost:8080/reserv/disabled-dates')
      .then(res => {
        const allDisabled = [];

        res.data.forEach(({ startDate, endDate }) => {
          const range = eachDayOfInterval({
            start: parseISO(startDate),
            end: parseISO(endDate)
          });
          allDisabled.push(...range);
        });

        console.log("Disabled Dates:", allDisabled);  // 여기에 로그 추가

        setDisabledDates(allDisabled);
      })
      .catch(err => {
        console.error('예약 불가 날짜 불러오기 실패', err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const expireAtDate = addDays(new Date(), 5);

    const payload = {
      startDate: format(dateRange[0].startDate, 'yyyy-MM-dd'),
      endDate: format(dateRange[0].endDate, 'yyyy-MM-dd'),
      expireAt: format(expireAtDate, 'yyyy-MM-dd'),
      countPeople: Number(countPeople),
      countPet: Number(countPet),
      member: { id: memberId },
      place: { id: placeId },
      tripPlan: tripPlanId ? { id: tripPlanId } : null,
    };

    try {
      const res = await axios.post('http://localhost:8080/reserv', payload);
      alert('예약 성공! 🎉'); // ✅ 성공 시 알림
      setMessage(res.data);
      window.location.reload(); 
    } catch (err) {
      const errorMsg = err.response?.data || '예약 생성 실패';
      alert(errorMsg); // ✅ 실패 시 알림
      setMessage(errorMsg);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 30 }}>{place.name}</h1>

      <div style={{ display: 'flex', gap: 40 }}>
        <div style={{ flex: 1 }}>
          <img
            src={place.imageUrl}
            alt={place.name}
            style={{ width: '100%', borderRadius: 8, marginBottom: 15 }}
          />
          <p style={{ lineHeight: 1.6, color: '#555' }}>{place.description}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: 10 }}>
            예약 날짜 (시작일 - 종료일):
          </label>

          <DateRange
            editableDateInputs={true}
            onChange={item => setDateRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            minDate={new Date()}
            disabledDates={disabledDates}
          />

          <p style={{ marginTop: 20, marginBottom: 20, fontWeight: 'bold' }}>
            만료일: {format(addDays(new Date(), 5), 'yyyy-MM-dd')} (자동 설정)
          </p>

          <label style={{ display: 'block', marginBottom: 10 }}>
            인원 수:
            <input
              type="number"
              min="1"
              value={countPeople}
              onChange={(e) => setCountPeople(e.target.value)}
              style={{ marginLeft: 10, padding: 6, width: 60 }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: 20 }}>
            반려동물 수:
            <input
              type="number"
              min="0"
              value={countPet}
              onChange={(e) => setCountPet(e.target.value)}
              style={{ marginLeft: 10, padding: 6, width: 60 }}
            />
          </label>

          <button
            type="submit"
            style={{
              backgroundColor: '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: 5,
              padding: '10px 20px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            예약 생성
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReservCreatePage;
