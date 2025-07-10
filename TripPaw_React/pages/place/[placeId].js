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
import { Tabs, Rate, Avatar, Button, Spin } from 'antd';
import {
  SunOutlined,
  // CloudOutlined,
  // ThunderboltOutlined,
  QuestionOutlined
} from '@ant-design/icons';

const { TabPane } = Tabs;

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

const TabsSection = styled.div`
  flex: 1;
  min-width: 300px;
`;

const PlaceReservCreatePage = () => {
  const router = useRouter();
  const [place, setPlace] = useState(null);
  const [dateRange, setDateRange] = useState([{ startDate: new Date(), endDate: addDays(new Date(), 1), key: 'selection' }]);
  const [disabledDates, setDisabledDates] = useState([]);
  const [countPeople, setCountPeople] = useState(1);
  const [countPet, setCountPet] = useState(0);
  const [placeId, setPlaceId] = useState(null);
  const [tripPlanId, setTripPlanId] = useState(null);
  const [message, setMessage] = useState('');
  const [isFavorite, setIsFavorite] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [canWriteReview, setCanWriteReview] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [likeStates, setLikeStates] = useState({});


  useEffect(() => {
    const fetchPlaceAndMember = async () => {
      if (!router.isReady) return;

      const id = router.query.placeId;
      if (!id) return;
      setPlaceId(Number(id));

      try {
        const res = await axios.get(`http://localhost:8080/place/${id}`);
        setPlace(res.data);
      } catch {
        setMessage('장소 정보를 불러오지 못했습니다.');
      }

      try {
        const res = await axios.get('http://localhost:8080/api/auth/check', { withCredentials: true });
        setMemberId(res.data.id);
        setIsLoggedIn(true);
      } catch (err) {
        console.error('로그인 정보 확인 실패:', err);
      }
    };

    fetchPlaceAndMember();
  }, [router.isReady]);

  // ✅ 즐겨찾기 체크는 placeId, memberId 설정 완료 후 별도로 실행
  useEffect(() => {
    const checkFavorite = async () => {
      if (!placeId || !memberId) return;

      try {
        const favRes = await axios.get(`http://localhost:8080/favorite/check`, {
          params: {
            memberId,
            targetId: placeId,
            targetType: 'PLACE',
          },
        });

        setIsFavorite(favRes.status === 200 && Number(favRes.data.targetId) === Number(placeId));
      } catch (err) {
        console.error('즐겨찾기 상태 확인 실패:', err);
      }
    };

    checkFavorite();
  }, [placeId, memberId]);

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
              end: parseISO(endDate),
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

  const toggleFavorite = async () => {
    try {
      const payload = {
        targetId: placeId,
        targetType: 'PLACE',
        member: { id: memberId },
      };

      if (isFavorite) {
        await axios.delete(`http://localhost:8080/favorite/delete`, { data: payload });
      } else {
        await axios.post(`http://localhost:8080/favorite/add`, payload);
      }

      const res = await axios.get(`http://localhost:8080/favorite/check`, {
        params: {
          memberId,
          targetId: placeId,
          targetType: 'PLACE',
        },
      });

      setIsFavorite(res.status === 200 && Number(res.data.targetId) === Number(placeId));
    } catch (err) {
      console.error('즐겨찾기 토글 실패', err);
    }
  };

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

  const getWeatherImageFileName = (condition) => {
    switch (condition) {
      case '흐림':
        return 'cloudy.png';
      case '비':
        return 'rain.png';
      case '눈':
        return 'snow.png';
      case '구름많음':
        return 'mostly-cloudy.png';
      case '맑음':
        return 'sun.png';
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. 로그인 여부 확인
        const authRes = await axios.get('http://localhost:8080/api/auth/check', {
          withCredentials: true,
        });
        const userId = authRes.data.id;
        setMemberId(userId);
        setIsLoggedIn(true);

        // 2. 예약 여부 확인
        const reservRes = await axios.get(`http://localhost:8080/review/reserv/check`, {
          params: { memberId: userId, placeId },
        });
        setCanWriteReview(reservRes.data === true);

        // 3. 리뷰 불러오기
        await fetchReviews(placeId, userId);
      } catch (err) {
        console.error('로그인 또는 예약 확인 실패:', err);
        setIsLoggedIn(false);
        setCanWriteReview(false);
      }
    };

    if (placeId) {
      fetchAllData();
    }
  }, [placeId]);
  const fetchReviews = async (placeId, memberId) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/review/place/${placeId}`);
      const reviews = res.data;
      setReviews(reviews);

      if (reviews.length > 0) {
        const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        setAvgRating(Number(avg.toFixed(1)));
        setReviewCount(reviews.length);
      }

      const newLikeStates = {};
      for (let review of reviews) {
        const [likedRes, countRes] = await Promise.all([
          memberId
            ? axios.get(`http://localhost:8080/review/${review.id}/like/marked`, {
              params: { memberId },
            })
            : Promise.resolve({ data: false }),
          axios.get(`http://localhost:8080/review/${review.id}/like/count`),
        ]);

        newLikeStates[review.id] = {
          liked: likedRes.data,
          count: countRes.data,
        };
      }

      setLikeStates(newLikeStates);
    } catch (err) {
      console.error('리뷰 불러오기 실패:', err);
    }
    setLoading(false);
  };

  const toggleLike = async (reviewId) => {
    if (!memberId) {
      message.warning('로그인 후 이용 가능합니다.');
      return;
    }

    try {
      const liked = likeStates[reviewId]?.liked;
      const url = `http://localhost:8080/review/${reviewId}/like`;

      if (liked) {
        await axios.delete(url, {
          params: { memberId },
        });
      } else {
        await axios.post(url, null, {
          params: { memberId },
        });
      }

      // 좋아요 상태 다시 가져오기
      const [likedRes, countRes] = await Promise.all([
        axios.get(`${url}/marked`, { params: { memberId } }),
        axios.get(`${url}/count`),
      ]);

      setLikeStates((prev) => ({
        ...prev,
        [reviewId]: {
          liked: likedRes.data,
          count: countRes.data,
        },
      }));
    } catch (err) {
      console.error('좋아요 처리 실패:', err);
      message.error('좋아요 처리에 실패했습니다.');
    }
  };


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
                  {isFavorite !== null && (
                    <img
                      src={`${isFavorite
                        ? '/image/other/favorite/favorite.png'
                        : '/image/other/favorite/notFavorite.png'}?t=${new Date().getTime()}`}
                      alt="즐겨 찾기"
                      className="favorite-icon"
                      onClick={toggleFavorite}
                    />
                  )}
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
              <TabsSection>
                <Tabs defaultActiveKey="reserv" style={{ marginTop: 32 }}>
                  <TabPane tab="예약" key="reserv">
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
                  </TabPane>
                  <TabPane tab="리뷰" key="review">
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                      <Rate value={avgRating} disabled />
                      <span style={{ marginLeft: 8 }}>{avgRating}</span>
                      <span style={{ marginLeft: 12, color: '#888' }}>리뷰 {reviewCount}개</span>
                      {isLoggedIn && canWriteReview && (
                        <Button
                          type="primary"
                          onClick={async () => {
                            try {
                              const res = await axios.get('http://localhost:8080/review/reserv/place', {
                                params: { memberId, placeId },
                              });

                              const reservId = res.data;

                              router.push({
                                pathname: '/review/write',
                                query: {
                                  reservId,              // 예약 ID
                                  reviewTypeId: 2,       // 장소 리뷰
                                  placeName: place.name,
                                },
                              });
                            } catch (err) {
                              console.error('예약 ID 가져오기 실패:', err);
                              message.error('예약 정보를 찾을 수 없습니다.');
                            }
                          }}
                          style={{ marginBottom: 20 }}
                        >
                          ✍️ 리뷰 작성하기
                        </Button>
                      )}
                    </div>

                    {loading ? (
                      <Spin tip="리뷰 불러오는 중..." />
                    ) : (
                      reviews.map(r => (
                        <div key={r.id} style={{ marginBottom: 24, borderBottom: '1px solid #eee', paddingBottom: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                              <Avatar size={48} />
                              <div style={{ marginLeft: 12 }}>
                                <div style={{ fontWeight: 600 }}>{r.member.nickname}</div>
                                <Rate value={r.rating} disabled style={{ fontSize: 14, margin: '4px 0' }} />
                                <div style={{ fontSize: 12, color: '#888' }}>{r.createdAt?.substring(0, 10)}</div>
                              </div>
                            </div>
                            <div style={{ fontSize: 24 }}>
                              {r.weatherCondition === '맑음' && <SunOutlined style={{ color: 'orange' }} />}
                              {['흐림', '비', '눈', '구름많음', '맑음'].includes(r.weatherCondition) && (
                                <img
                                  src={`/image/weather/${getWeatherImageFileName(r.weatherCondition)}`}
                                  alt={r.weatherCondition}
                                  style={{ width: 50, height: 50 }}
                                />
                              )}
                              {r.weatherCondition === '알 수 없음' && <QuestionOutlined style={{ color: '#aaa' }} />}
                            </div>
                          </div>

                          <div style={{ marginTop: 12 }}>{r.content}</div>
                          <Button
                            block
                            type={likeStates[r.id]?.liked ? 'primary' : 'default'}
                            onClick={() => toggleLike(r.id)}
                            style={{ marginTop: 12 }}
                          >
                            👍 도움이 돼요 {likeStates[r.id]?.count ?? 0}
                          </Button>
                        </div>
                      ))
                    )}
                  </TabPane>
                </Tabs>
              </TabsSection>
            </Layout>
            <PetAssistant />
          </Container>
        )}
      </ScrollContainer>
    </AppLayout>
  );
};

export default PlaceReservCreatePage;
