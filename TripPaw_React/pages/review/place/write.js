import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Rate, Input, Button, message } from 'antd';
import axios from 'axios';

const { TextArea } = Input;

const PlaceReviewWrite = () => {
  const router = useRouter();
  const { tripPlanId } = router.query;
  const { placeId } = router.query;
  const [memberId, setMemberId] = useState(null);
  const [reservs, setReservs] = useState([]);
  const [reviews, setReviews] = useState({}); // {reservId: {rating, content}}
  const [loading, setLoading] = useState(false);
  const formData = new FormData();
  formData.append(
    'review',
    new Blob([JSON.stringify(reviewDto)], { type: 'application/json' })
  );

  // 1. 로그인 사용자 조회
  useEffect(() => {
    axios.get('http://localhost:8080/api/auth/check', { withCredentials: true })
      .then(res => setMemberId(res.data.id))
      .catch(err => {
        message.error("로그인이 필요합니다.");
        router.push('/member/login');
      });
  }, []);

  // 2. 예약 목록 조회
  useEffect(() => {
    if (!tripPlanId || !memberId) return;

    axios.get(`http://localhost:8080/review/trip/${tripPlanId}/places`, {
      params: { memberId },
    })
      .then(res => setReservs(res.data))
      .catch(err => {
        console.error("예약 목록 로딩 실패:", err);
        message.error("장소 목록을 불러오지 못했습니다.");
      });
  }, [tripPlanId, memberId]);

  useEffect(() => {
    if (!placeId) return;

    axios.get(`http://localhost:8080/review/place/${placeId}`)
      .then((res) => {
        setReviews(res.data); // review + place 정보 포함
      })
      .catch((err) => {
        console.error('리뷰 불러오기 실패:', err);
      });
  }, [placeId]);

  // 3. 입력 핸들러
  const handleChange = (reservId, field, value) => {
    setReviews(prev => ({
      ...prev,
      [reservId]: {
        ...prev[reservId],
        [field]: value,
      },
    }));
  };

  // 4. 리뷰 저장
  const handleSubmit = async (reservId) => {
    const review = reviews[reservId];
    if (!review || !review.rating || !review.content) {
      message.warning("별점과 내용을 입력해주세요.");
      return;
    }

    const reviewDto = {
      memberId,
      reviewTypeId: 2, // PLACE
      targetId: reservId,
      rating: review.rating,
      content: review.content,
    };

    try {
      setLoading(true);
      await axios.post('http://localhost:8080/review/write', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      message.success("리뷰가 저장되었습니다.");
    } catch (err) {
      console.error("리뷰 저장 실패:", err);
      message.error("리뷰 저장 실패");
    } finally {
      setLoading(false);
    }
  };

  if (!tripPlanId || !memberId) return <div>로딩 중...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h2>장소 리뷰</h2>

      {reservs.length === 0 ? (
        <div>등록된 장소가 없습니다.</div>
      ) : (
        reservs.map((reserv) => {
          const review = reviews[reserv.id] || {};
          return (
            <div key={reserv.id} style={{ marginBottom: 32, borderBottom: '1px solid #ddd', paddingBottom: 16 }}>
              <h3>{reserv.place?.name || '장소 이름 없음'}</h3>
              <Rate
                value={review.rating || 0}
                onChange={(value) => handleChange(reserv.id, 'rating', value)}
              />
              <TextArea
                rows={4}
                value={review.content || ''}
                onChange={(e) => handleChange(reserv.id, 'content', e.target.value)}
                placeholder="이 장소에 대한 리뷰를 작성해주세요"
                style={{ marginTop: 10 }}
              />
              <Button
                type="primary"
                onClick={() => handleSubmit(reserv.id)}
                loading={loading}
                style={{ marginTop: 10 }}
              >
                저장
              </Button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default PlaceReviewWrite;
