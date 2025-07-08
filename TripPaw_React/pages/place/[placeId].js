import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format, addDays, eachDayOfInterval, parseISO } from 'date-fns';
import { useRouter } from 'next/router';
import PetAssistant from '../../components/pet/petassistant';
import styled from 'styled-components';
import AppLayout from '@/components/AppLayout';

const ScrollContainer = styled.div`
  width: 100%;
  height: calc(100vh - 100px);
  overflow-y: auto;
`;

const Container = styled.div`
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

  p {
    color: #555;
    line-height: 1.6;
    font-size: 1rem;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;

  img.place-image {
    width: 100%;
    height: 280px;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  }

  img.favorite-icon {
    position: absolute;
    top: -5px;
    right: 12px;
    width: 60px;
    height: 55px;
    cursor: pointer;
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

function PlaceReservCreatePage() {
  const router = useRouter();
  const [place, setPlace] = useState(null);
  const [dateRange, setDateRange] = useState([{ startDate: new Date(), endDate: addDays(new Date(), 1), key: 'selection' }]);
  const [disabledDates, setDisabledDates] = useState([]);
  const [countPeople, setCountPeople] = useState(1);
  const [countPet, setCountPet] = useState(0);
  const [placeId, setPlaceId] = useState(null);
  const [tripPlanId, setTripPlanId] = useState(null);
  const [message, setMessage] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 위한 state
  const [memberId, setMemberId] = useState(1);

  // 로그인 한 유저 id가져오기
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/check', {
          withCredentials: true,
        });

        console.log('user : ', response.data);

        if (response.status === 200) {
          setIsLoggedIn(true);
          // 백엔드에서 받은 username으로 상태 업데이트
          setMemberId(response.data.id);
          return true; // 성공 시 true 반환
        }
      } catch (error) {
        console.error("로그인 상태 확인 실패:", error);
        alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
        router.push('/member/login');
        return false; // 실패 시 false 반환
      }
    };
    checkLoginStatus();
  }, [router.isReady, router.query]);

  const checkFavorite = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/favorite/check`, {
        params: {
          memberId,
          targetId: placeId,
          targetType: 'PLACE',
        }
      });
      setIsFavorite(res.status === 200 && res.data);
    } catch (err) {
      if (err.response?.status === 204) {
        setIsFavorite(false);
      } else {
        console.error('즐겨찾기 여부 확인 실패', err);
      }
    }
  };

  const toggleFavorite = async () => {
    try {
      const payload = {
        targetId: placeId,
        targetType: 'PLACE',
        member: { id: memberId }
      };

      if (isFavorite) {
        await axios.delete(`http://localhost:8080/favorite/delete`, { data: payload });
      } else {
        await axios.post(`http://localhost:8080/favorite/add`, payload);
      }

      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('즐겨찾기 토글 실패', err);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    const { placeId } = router.query;
    if (!placeId) return;
    setPlaceId(Number(placeId));

    axios.get(`http://localhost:8080/place/${placeId}`)
      .then(res => setPlace(res.data))
      .catch(err => setMessage('장소 정보를 불러오지 못했습니다.'));
  }, [router.isReady, router.query.placeId]);

  useEffect(() => {
    if (placeId) checkFavorite();
  }, [placeId]);

  useEffect(() => {
    if (!placeId) return;

    axios.get(`http://localhost:8080/reserv/disabled-dates?placeId=${placeId}`)
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
  }, [placeId]);


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
      router.push({
        pathname: '/pay/pay',
        query: {
          reservId: res.data.id,
          memberId,
          countPeople,
          countPet,
          startDate: payload.startDate,
          endDate: payload.endDate,
          amount: 10000,
        },
      });
    } catch (err) {
      const errorMsg = err.response?.data || '예약 생성 실패';
      alert(errorMsg);
      setMessage(errorMsg);
    }
  };

  const fallbackImages = useMemo(() => {
    if (!place) return {};
    const randomNum = Math.floor(Math.random() * 10) + 1;
    return { [place.id]: `/image/other/randomImage/${randomNum}.jpg` };
  }, [place]);

  return (
    <AppLayout>
      <div style={{ width: '100%', height: '100px' }} />
      <ScrollContainer>
        {!place ? (
          <Container>
            <Title>장소 정보를 불러오는 중입니다...</Title>
          </Container>
        ) : (
          <Container>
            <Title>{place.name}</Title>
            <Layout>
              <ImageSection>
                <ImageWrapper>
                  <img
                    alt="장소 이미지"
                    className="place-image"
                    src={place.imageUrl && place.imageUrl.length > 0 ? place.imageUrl : fallbackImages[place.id]}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/image/other/tempImage.jpg";
                    }}
                  />
                  <img
                    src={isFavorite ? '/image/other/favorite/favorite.png' : '/image/other/favorite/notFavorite.png'}
                    alt="즐겨 찾기"
                    className="favorite-icon"
                    onClick={toggleFavorite}
                  />
                </ImageWrapper>
                <p>{place.description || '반려동물과 함께하는 행복한 여행!'}</p>
                <p><strong>📍 주소:</strong> {place.region}</p>
                <p><strong>☎️ 전화:</strong> {place.phone}</p>
                <p><strong>💰 가격:</strong> {place.price}</p>
                <p><strong>📂 카테고리:</strong> {place.placeType?.name}</p>
                {place.homePage && (
                  <p><strong>🔗 홈페이지:</strong> <a href={place.homePage} target="_blank" rel="noopener noreferrer">{place.homePage}</a></p>
                )}
              </ImageSection>
              <Form onSubmit={handleSubmit}>
                <div>
                  <Label>예약 날짜</Label>
                  <DateRange
                    editableDateInputs
                    onChange={item => setDateRange([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={dateRange}
                    minDate={new Date()}
                    disabledDates={disabledDates}
                  />
                </div>
                <ExpireText>⏳ 만료일: <strong>{format(addDays(new Date(), 5), 'yyyy-MM-dd')}</strong></ExpireText>
                <div>
                  <Label>인원 수</Label>
                  <Input type="number" min="1" value={countPeople} onChange={(e) => setCountPeople(e.target.value)} />
                </div>
                <div>
                  <Label>반려동물 수</Label>
                  <Input type="number" min="0" value={countPet} onChange={(e) => setCountPet(e.target.value)} />
                </div>
                <SubmitButton type="submit">📝 예약 생성하기</SubmitButton>
                {message && <ErrorMsg>{message}</ErrorMsg>}
              </Form>
            </Layout>
            <PetAssistant />
          </Container>
        )}
      </ScrollContainer>
    </AppLayout>
  );
}

export default PlaceReservCreatePage;
