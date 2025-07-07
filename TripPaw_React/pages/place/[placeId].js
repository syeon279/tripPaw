import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format, addDays, eachDayOfInterval, parseISO } from 'date-fns';
import { useRouter } from 'next/router';
import ContentHeader from '../../components/ContentHeader';
import PetAssistant from '../../components/pet/petassistant';
import styled from 'styled-components';
import AppLayout from '@/components/AppLayout';

const Container = styled.div`
  border: 2px solid red;
  //max-width: 1000px;
  width: 80%;
  margin: auto;
  padding: 30px;
  font-family: 'Segoe UI', sans-serif;
  background: #fdfdfd;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 40px;
  color: #222;
`;

const Layout = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
`;

const ImageSection = styled.div`
  flex: 1;
  min-width: 300px;

  img {
    width: 100%;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  }

  p {
    color: #555;
    line-height: 1.6;
    font-size: 1rem;
  }
`;

const Form = styled.form`
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
`;

const Input = styled.input`
  width: 100px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const ExpireText = styled.p`
  font-size: 0.95rem;
  color: #666;
`;

const SubmitButton = styled.button`
  background-color: #2c7be5;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background 0.3s;

  &:hover {
    background-color: #1a5edb;
  }
`;

const ErrorMsg = styled.p`
  color: red;
  font-weight: bold;
`;

const layoutStyle = {
  header: { width: '100%', height: '100px' },
  divider: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginBottom: '20px',
  },
  dividerLine: {
    width: '100%',
    border: '1px solid rgba(170, 169, 169, 0.9)',
  },
  contentWrapper: {
    width: '70%',
    height: '80%',
    justifyContent: 'center',
    margin: 'auto',
  },
  contentBox: {
    display: 'flex',
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    margin: 'auto',
  },
  mapContainer: {
    flex: 5,
    width: '100%',
    height: '100%',
  },
  scheduleContainer: {
    flex: 3,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    overflowY: 'auto',
    maxHeight: '600px',
    paddingRight: '8px',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    overscrollBehavior: 'contain',
  },
};

function PlaceReservCreatePage() {
  const router = useRouter();
  const [place, setPlace] = useState(null);
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
  const [placeId, setPlaceId] = useState(null);
  const [tripPlanId, setTripPlanId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!router.isReady) return;

    const { placeId } = router.query;

    if (!placeId) {
      console.warn('❗ placeId가 아직 없습니다.');
      return;
    }

    console.log('🔍 라우터에서 받은 placeId:', placeId);

    setPlaceId(Number(placeId));

    axios.get(`http://localhost:8080/place/${placeId}`)
      .then(res => {
        console.log('📦 장소 데이터:', res.data);
        setPlace(res.data);
      })
      .catch(err => {
        console.error('❌ 장소 정보 로딩 실패:', err);
        setMessage('장소 정보를 불러오지 못했습니다.');
      });
  }, [router.isReady, router.query.placeId]);

  useEffect(() => {
    axios.get('http://localhost:8080/reserv/disabled-dates')
      .then(res => {
        const allDisabled = [];
        const today = new Date();

        res.data.forEach(({ startDate, endDate }) => {
          if (parseISO(endDate) >= today) {
            const range = eachDayOfInterval({
              start: parseISO(startDate),
              end: parseISO(endDate)
            });
            allDisabled.push(...range);
          }
        });

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
      alert('예약 성공! 🎉');

      const reservId = res.data.id;

      router.push({
        pathname: '/pay/pay',
        query: {
          reservId,
          memberId,
          countPeople,
          countPet,
          startDate: payload.startDate,
          endDate: payload.endDate,
          amount: 10000
        }
      });
    } catch (err) {
      const errorMsg = err.response?.data || '예약 생성 실패';
      alert(errorMsg);
      setMessage(errorMsg);
    }
  };

  return (
    <>
      <AppLayout >
        <div style={layoutStyle.header} />
        {!place ? (
          <Container>
            <Title>장소 정보를 불러오는 중입니다...</Title>
          </Container>
        ) : (
          <Container>
            <Title>{place.name}</Title>

            <Layout>
              <ImageSection>
                <img src={place.imageUrl || '/default.jpg'} alt={place.name} />
                <p>{place.description || '반려동물과 함께하는 행복한 여행!'}</p>

                <p><strong>📍 주소:</strong> {place.region}</p>
                <p><strong>☎️ 전화:</strong> {place.phone}</p>
                <p><strong>💰 가격:</strong> {place.price}</p>
                <p><strong>📂 카테고리:</strong> {place.placeType?.name}</p>

                {/* <p>
                <strong>🐾 반려동물 동반:</strong>{' '}
                {place.petFriendly ? '가능' : '불가'} /{' '}
                {place.petVerified ? '인증됨' : '미인증'}
              </p> */}

                {place.homePage && (
                  <p>
                    <strong>🔗 홈페이지:</strong>{' '}
                    <a href={place.homePage} target="_blank" rel="noopener noreferrer">
                      {place.homePage}
                    </a>
                  </p>
                )}
              </ImageSection>


              <Form onSubmit={handleSubmit}>
                <div>
                  <Label>예약 날짜</Label>
                  <DateRange
                    editableDateInputs={true}
                    onChange={item => setDateRange([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={dateRange}
                    minDate={new Date()}
                    disabledDates={disabledDates}
                  />
                </div>

                <ExpireText>⏳ 만료일: <strong>{format(addDays(new Date(), 5), 'yyyy-MM-dd')}</strong> (자동 설정)</ExpireText>

                <div>
                  <Label>인원 수</Label>
                  <Input
                    type="number"
                    min="1"
                    value={countPeople}
                    onChange={(e) => setCountPeople(e.target.value)}
                  />
                </div>

                <div>
                  <Label>반려동물 수</Label>
                  <Input
                    type="number"
                    min="0"
                    value={countPet}
                    onChange={(e) => setCountPet(e.target.value)}
                  />
                </div>

                <SubmitButton type="submit">📝 예약 생성하기</SubmitButton>

                {message && <ErrorMsg>{message}</ErrorMsg>}
              </Form>
            </Layout>
            <PetAssistant />
          </Container>
        )}
      </AppLayout>
    </>
  );
}

export default PlaceReservCreatePage;