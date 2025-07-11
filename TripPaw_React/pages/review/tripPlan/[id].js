import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import AppLayout from '@/components/AppLayout';
import axios from 'axios';
import { Card, Rate, Spin, Button, Tooltip } from 'antd';
import { LikeOutlined, LikeFilled, CloudOutlined, SunOutlined, QuestionOutlined } from '@ant-design/icons';

const RouteMapNoSSR = dynamic(() => import('@/components/tripPlan/RouteMap'), {
  ssr: false,
});

const weatherIcon = (condition) => {
  switch (condition) {
    case '맑음':
      return <SunOutlined style={{ fontSize: 24, color: '#fadb14' }} />;
    case '흐림':
      return <CloudOutlined style={{ fontSize: 24, color: '#8c8c8c' }} />;
    case '구름많음':
      return <CloudOutlined style={{ fontSize: 24, color: '#1890ff' }} />;
    default:
      return <QuestionOutlined style={{ fontSize: 24, color: '#aaa' }} />;
  }
};

const ReviewTripPlanDetail = () => {
  const router = useRouter();
  const { id: planId, title } = router.query;
  const [reviews, setReviews] = useState([]);
  const [routeData, setRouteData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [memberId, setMemberId] = useState(null);
  const [canWriteReview, setCanWriteReview] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [likeStates, setLikeStates] = useState({});
  const [authorNickname, setAuthorNickname] = useState(null);


  useEffect(() => {
    if (!planId) return;

    const fetchData = async () => {
      try {
        const [reviewRes, planRes] = await Promise.all([
          axios.get(`http://localhost:8080/review/plan/${planId}`),
          axios.get(`http://localhost:8080/tripPlan/${planId}`),
        ]);

        const fetchedReviews = reviewRes.data || [];
        setReviews(fetchedReviews);
        setRouteData(planRes.data.routeData || []);
        console.log('planRes: ', planRes);
        setAuthorNickname(planRes.data.authorNickname);

        if (fetchedReviews.length > 0) {
          const sum = fetchedReviews.reduce((acc, r) => acc + r.rating, 0);
          setAverageRating(sum / fetchedReviews.length);
        } else {
          setAverageRating(0);
        }
      } catch (err) {
        console.error('리뷰 또는 경로 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [planId]);

  useEffect(() => {
    if (!planId || !isLoggedIn || !memberId || reviews.length === 0) return;

    const fetchLikeStates = async () => {
      const states = {};

      await Promise.all(
        reviews.map(async (review) => {
          try {
            const [markedRes, countRes] = await Promise.all([
              axios.get(`http://localhost:8080/review/${review.id}/like/marked`, {
                params: { memberId },
                withCredentials: true,
              }),
              axios.get(`http://localhost:8080/review/${review.id}/like/count`)
            ]);
            states[review.id] = {
              liked: markedRes.data,
              count: countRes.data
            };
          } catch (err) {
            console.error(`리뷰 ${review.id} 좋아요 상태 불러오기 실패`, err);
          }
        })
      );

      setLikeStates(states);
    };

    fetchLikeStates();
  }, [reviews, isLoggedIn, memberId]);

  useEffect(() => {
    const checkLoginAndReservation = async () => {
      try {
        const authRes = await axios.get('http://localhost:8080/api/auth/check', { withCredentials: true });
        const memberId = authRes.data.id;
        setIsLoggedIn(true);
        setMemberId(memberId);

        const reservRes = await axios.get('http://localhost:8080/review/reserv/check-tripPlan', {
          params: { memberId, tripPlanId: planId },
        });

        setCanWriteReview(reservRes.data === true);
      } catch (err) {
        console.error('로그인 또는 예약 확인 실패:', err);
        setIsLoggedIn(false);
        setCanWriteReview(false);
      }
    };

    if (planId) {
      checkLoginAndReservation();
    }
  }, [planId]);

  const toggleLike = async (reviewId) => {
    if (!isLoggedIn || !memberId) {
      alert('로그인이 필요합니다.');
      return;
    }

    const current = likeStates[reviewId];
    try {
      if (current?.liked) {
        await axios.delete(`http://localhost:8080/review/${reviewId}/like`, {
          params: { memberId },
          withCredentials: true,
        });
        setLikeStates((prev) => ({
          ...prev,
          [reviewId]: { liked: false, count: prev[reviewId].count - 1 }
        }));
      } else {
        await axios.post(`http://localhost:8080/review/${reviewId}/like`, null, {
          params: { memberId },
          withCredentials: true,
        });
        setLikeStates((prev) => ({
          ...prev,
          [reviewId]: { liked: true, count: prev[reviewId].count + 1 }
        }));
      }
    } catch (err) {
      console.error('좋아요 토글 실패:', err);
    }
  };

  if (loading) return <Spin fullscreen />;

  return (
    <AppLayout>
      <div style={{ height: '80px' }}> </div>
      <div style={{ display: 'flex', height: 'calc(100vh - 120px)', margin: 'auto', padding: '0px', width: '80%' }}>
        {/* 좌측 지도 */}
        <div style={{ flex: 1, height: '100%', padding: '15px' }}>
          <RouteMapNoSSR
            routeData={routeData}
            focusDay={null}
            setFocusDay={() => { }}
            setMapInstance={() => { }}
          />
        </div>

        {/* 우측 리뷰 목록 */}
        <div style={{ flex: 1, padding: '0px', overflowY: 'auto', height: '100%', border: '0px solid black', padding: '10px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid rgba(167, 167, 167, 0.6)'
            , padding: '20px'
          }}>
            <div>
              <div style={{ display: 'flex' }}>
                <h2 style={{ marginBottom: 4 }}>{title}</h2>
                <div style={{ marginTop: '8px', marginLeft: '10px' }}> {authorNickname} </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#f5222d', fontWeight: 600, fontSize: 14, marginRight: '10px' }}>
                  {averageRating.toFixed(1)} <Rate disabled allowHalf value={averageRating} style={{ fontSize: 16, marginLeft: '4px' }} />
                </span>
                <div style={{ margin: '0 10px' }}> | </div>
                <span style={{ marginLeft: 8, color: '#888' }}>  {reviews.length}개</span>
              </div>
            </div>
            {isLoggedIn && canWriteReview && (
              <Button
                type="primary"
                onClick={() =>
                  router.push({
                    pathname: '/review/write',
                    query: {
                      reviewTypeId: 1,
                      targetId: planId,
                      title: title || '',
                    },
                  })
                }
              >
                ✍ 리뷰 작성하기
              </Button>
            )}
          </div>

          <div style={{ marginTop: 20 }}>
            {reviews.length === 0 ? (
              <p>아직 작성된 리뷰가 없습니다.</p>
            ) : (
              reviews.map((review) => (
                <Card key={review.id} style={{
                  marginBottom: 20, borderTop: 'none', borderLeft: 'none', borderRight: 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '20px', marginRight: '10px' }}>{review.memberNickname}</div>
                        <div style={{ fontSize: 12, color: '#888', marginTop: '10px' }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Rate disabled defaultValue={review.rating} style={{ fontSize: 16 }} />
                    </div>
                    <div>{weatherIcon(review.weather)}</div>
                  </div>
                  <p style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{review.content}</p>
                  {review.imageUrls && review.imageUrls.length > 0 && (
                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                      {review.imageUrls.split(',').map((url, idx) => (
                        <img
                          key={idx}
                          src={`http://localhost:8080/upload/reviews/${url.trim()}`}
                          alt={`review-${idx}`}
                          style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                          onError={(e) => { e.target.src = '/image/other/tempImage.jpg'; }}
                        />
                      ))}
                    </div>
                  )}
                  <div
                    block
                    style={{
                      cursor: 'pointer',
                      marginTop: 12,
                      //border: '1px solid #ddd',
                      borderRadius: '10px'
                    }}
                    onClick={() => toggleLike(review.id)}
                  >
                    {likeStates[review.id]?.liked ? <LikeFilled /> : <LikeOutlined />} 도움이 돼요
                    <span style={{ marginLeft: 4 }}>({likeStates[review.id]?.count ?? 0})</span>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ReviewTripPlanDetail;
