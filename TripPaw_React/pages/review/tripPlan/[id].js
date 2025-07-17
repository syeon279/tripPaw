import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import AppLayout from '@/components/AppLayout';
import axios from 'axios';
import { Card, Rate, Spin, Button } from 'antd';
import {
  LikeOutlined,
  LikeFilled,
  CloudOutlined,
  SunOutlined,
  QuestionOutlined,
} from '@ant-design/icons';

const RouteMapNoSSR = dynamic(() => import('@/components/tripPlan/RouteMap'), { ssr: false });

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
  const [planTitle, setPlanTitle] = useState('');
  const [averageRating, setAverageRating] = useState(0);
  const [likeStates, setLikeStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [memberId, setMemberId] = useState(null);
  const [canWriteReview, setCanWriteReview] = useState(false);

  // ✅ 로그인 + 리뷰/트립플랜 정보 + 작성 여부 체크
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const authRes = await axios.get('http://localhost:8080/api/auth/check', {
          withCredentials: true,
        });
        const memberId = authRes.data.id;
        setIsLoggedIn(true);
        setMemberId(memberId);

        const [reviewRes, planRes] = await Promise.all([
          axios.get(`http://localhost:8080/review/plan/${planId}`),
          axios.get(`http://localhost:8080/tripPlan/${planId}`),
        ]);
        console.log('리뷰 작성자 ID들:', reviews.map((r) => r.memberId));
console.log('현재 로그인 ID:', memberId);

        const fetchedReviews = reviewRes.data || [];
        setReviews(fetchedReviews);
        setRouteData(planRes.data.routeData || []);
        setPlanTitle(planRes.data.title || '');

        if (fetchedReviews.length > 0) {
          const sum = fetchedReviews.reduce((acc, r) => acc + r.rating, 0);
          setAverageRating(sum / fetchedReviews.length);
        } else {
          setAverageRating(0);
        }

        // 리뷰 작성 여부 확인
        const hasWritten = fetchedReviews.some((r) => r.memberId === memberId);
        setCanWriteReview(!hasWritten);
      } catch (err) {
        console.error('데이터 로딩 실패:', err);
        setIsLoggedIn(false);
        setCanWriteReview(false);
      } finally {
        setLoading(false);
      }
    };

    if (planId) fetchAll();
  }, [planId]);

  // ✅ 좋아요 상태
  useEffect(() => {
    if (!memberId || reviews.length === 0) return;

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
              axios.get(`http://localhost:8080/review/${review.id}/like/count`),
            ]);
            states[review.id] = {
              liked: markedRes.data,
              count: countRes.data,
            };
          } catch (err) {
            console.error(`좋아요 상태 실패: ${review.id}`, err);
          }
        })
      );

      setLikeStates(states);
    };

    fetchLikeStates();
  }, [memberId, reviews]);

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
          [reviewId]: { liked: false, count: prev[reviewId].count - 1 },
        }));
      } else {
        await axios.post(`http://localhost:8080/review/${reviewId}/like`, null, {
          params: { memberId },
          withCredentials: true,
        });
        setLikeStates((prev) => ({
          ...prev,
          [reviewId]: { liked: true, count: prev[reviewId].count + 1 },
        }));
      }
    } catch (err) {
      console.error('좋아요 토글 실패:', err);
    }
  };

  if (loading) return <Spin fullscreen />;

  return (
    <AppLayout>
      <div style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
        {/* 타이틀 */}
        <div
          style={{
            marginTop: 40,
            padding: '20px',
            paddingTop: '40px',
            borderBottom: '1px solid #eee',
            background: '#fff',
            zIndex: 1,
          }}
        >
          <h1 style={{ margin: 0, fontSize: 24, textAlign: 'center' }}>{planTitle}</h1>
        </div>

        {/* 지도 + 리뷰 */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* 지도 */}
          <div style={{ flex: 1.5, height: '100%' }}>
            <RouteMapNoSSR
              routeData={routeData}
              focusDay={null}
              setFocusDay={() => {}}
              setMapInstance={() => {}}
            />
          </div>

          {/* 리뷰 목록 */}
          <div style={{ flex: 1, padding: 20, overflowY: 'auto', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: '#f5222d', fontWeight: 600, fontSize: 16 }}>
                  {averageRating.toFixed(1)}{' '}
                  <Rate disabled allowHalf value={averageRating} style={{ fontSize: 16 }} />
                </span>
                <span style={{ marginLeft: 8, color: '#888' }}>리뷰 {reviews.length}개</span>
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
                  <Card key={review.id} style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{review.memberNickname}</div>
                        <Rate disabled defaultValue={review.rating} style={{ fontSize: 16 }} />
                        <div style={{ fontSize: 12, color: '#888' }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
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
                            style={{
                              width: 100,
                              height: 100,
                              objectFit: 'cover',
                              borderRadius: 8,
                            }}
                            onError={(e) => {
                              e.target.src = '/image/other/tempImage.jpg';
                            }}
                          />
                        ))}
                      </div>
                    )}
                    <div
                      style={{
                        cursor: 'pointer',
                        marginTop: 12,
                        border: '1px solid #ddd',
                        padding: '4px 8px',
                        borderRadius: 4,
                        display: 'inline-block',
                      }}
                      onClick={() => toggleLike(review.id)}
                    >
                      {likeStates[review.id]?.liked ? <LikeFilled /> : <LikeOutlined />}{' '}
                      도움이 돼요 ({likeStates[review.id]?.count ?? 0})
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ReviewTripPlanDetail;
