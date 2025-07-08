import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tabs, Rate, Button, Image, Modal, message } from 'antd';
import { CloseOutlined, QuestionOutlined, SunOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

const { TabPane } = Tabs;

const MyReviewList = ({ memberId }) => {
  const [reviews, setReviews] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (memberId) {
      fetchReviews();
    }
  }, [memberId]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/review/member/${memberId}`);
      setReviews(res.data);
    } catch (err) {
      console.error('리뷰 불러오기 실패', err);
    }
  };

  const handleEdit = (reviewId) => {
    router.push(`/review/${reviewId}/edit`);
  };

  const handleDelete = async (reviewId) => {
    Modal.confirm({
      title: '리뷰를 삭제하시겠습니까?',
      content: '삭제된 리뷰는 복구할 수 없습니다.',
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          await axios.delete(`/review/${reviewId}`);
          message.success('리뷰가 삭제되었습니다.');
          fetchReviews(); // 삭제 후 목록 갱신
        } catch (err) {
          console.error('삭제 실패', err);
          message.error('리뷰 삭제에 실패했습니다.');
        }
      },
    });
  };

  const getWeatherImageFileName = (condition) => {
    switch (condition) {
      case '맑음':
        return 'sun.png';
      case '흐림':
        return 'cloudy.png';
      case '비':
        return 'rain.png';
      case '눈':
        return 'snow.png';
      case '구름많음':
        return 'mostly-cloudy.png';
      // default:
      //   return 'unknown.png'; // fallback (optional)
    }
  };

  const groupedReviews = {
    PLACE: reviews.filter((r) => r.reviewType?.toUpperCase() === 'PLACE'),
    PLAN: reviews.filter((r) => r.reviewType?.toUpperCase() === 'PLAN'),
  };

  const renderReviewCard = (review) => (
    <div key={review.id} style={{ background: '#fff', padding: 16, marginBottom: 24, position:    'relative' }}>
      <div>
        <div style={{ fontWeight: 600 }}>{review.tripTitle}</div>
        <div style={{ color: '#888' }}>{review.tripStartDate} ~ {review.tripEndDate}</div>
      </div>

      <Rate disabled value={review.rating} style={{ fontSize: 14, marginTop: 8 }} />

      {/* 👇 날씨 아이콘 위치 조정 */}
      <div style={{ position: 'absolute', top: 56, right: 16 }}>
        {review.weatherCondition === '맑음' && (
          <img
            src={`/image/weather/${getWeatherImageFileName(review.weatherCondition)}`}
            alt={review.weatherCondition}
            style={{ width: 40, height: 40 }}
          />
        )}
        {review.weatherCondition === '흐림' && 
          (<img
            src={`/image/weather/${getWeatherImageFileName(review.weatherCondition)}`}
            alt={review.weatherCondition}
            style={{ width: 40, height: 40 }}
            />
          )}
        {review.weatherCondition === '비' && 
          (<img
            src={`/image/weather/${getWeatherImageFileName(review.weatherCondition)}`}
            alt={review.weatherCondition}
            style={{ width: 40, height: 40 }}
            />
          )}
        {review.weatherCondition === '눈' && 
          (<img
            src={`/image/weather/${getWeatherImageFileName(review.weatherCondition)}`}
            alt={review.weatherCondition}
            style={{ width: 40, height: 40 }}
            />
          )}
        {review.weatherCondition === '구름많음' && 
          (<img
            src={`/image/weather/${getWeatherImageFileName(review.weatherCondition)}`}
            alt={review.weatherCondition}
            style={{ width: 40, height: 40 }}
            />
          )}
        {review.weatherCondition === '알 수 없음' && (
          <QuestionOutlined style={{ color: '#aaa', fontSize: 24 }} />
        )}
      </div>

      <div style={{ margin: '8px 0', color: '#555' }}>{review.createdAt}</div>
      <p style={{ whiteSpace: 'pre-wrap' }}>{review.content}</p>

      {review.imageUrl && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Image
            src={review.imageUrl.startsWith('http')
              ? review.imageUrl
              : `http://localhost:8080/upload/reviews/${review.imageUrl}`}
            width={100}
            height={100}
            style={{ objectFit: 'cover' }}
          />
          {review.imageCount > 1 && (
            <div style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              color: '#fff',
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: 12,
            }}>
              {review.imageCount}
            </div>
          )}
        </div>
      )}

      <Button onClick={() => handleEdit(review.reviewId)} style={{ position: 'absolute', right: 16, bottom: 16 }}>
        수정하기
      </Button>

      <CloseOutlined
        onClick={() => handleDelete(review.reviewId)}
        style={{ position: 'absolute', top: 16, right: 16, cursor: 'pointer', fontSize: 16, color: '#888' }}
      />
    </div>
  );

  return (
    <Tabs defaultActiveKey="PLAN">
      <TabPane tab="장소리뷰" key="PLACE">
        {groupedReviews.PLACE.map(renderReviewCard)}
      </TabPane>
      <TabPane tab="경로리뷰" key="PLAN">
        {groupedReviews.PLAN.map(renderReviewCard)}
      </TabPane>
    </Tabs>
  );
};

export default MyReviewList;
