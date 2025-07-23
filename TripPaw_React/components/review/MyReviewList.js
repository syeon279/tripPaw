import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tabs, Rate, Button, Image, Modal, message } from 'antd';
import { CloseOutlined, QuestionOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Link from 'next/link';

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
          fetchReviews();
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
      default:
        return null;
    }
  };

  const groupedReviews = {
    PLACE: reviews.filter((r) => r.reviewType?.toUpperCase() === 'PLACE'),
    PLAN: reviews.filter((r) => r.reviewType?.toUpperCase() === 'PLAN'),
  };

  const renderReviewCard = (review) => {
    const isPlace = review.reviewType === 'PLACE';
    console.log('review:', review);
    return (

      <div key={review.reviewId} style={{
        background: '#fff',
        padding: 16,
        marginBottom: 32,
        borderRadius: 8,
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        position: 'relative'
      }}>

        {/* 상단 정보 */}
        <div style={{ marginBottom: 12, borderBottom: '1px solid #ddd', paddingBottom: 8 }}>
          {/* PLAN 리뷰: 여행 경로 제목 + 날짜 */}
          {!isPlace && (
            <>
              <div style={{
                fontWeight: 'bold', fontSize: 16, cursor: 'pointer'
              }}
                onClick={() => router.push(`/review/tripPlan/${review.targetId}`)}
              >
                {review.tripTitle || '제목 없음'}
              </div>
              <div style={{ color: '#888', fontSize: 14 }}>
              </div>
            </>
          )}

          {/* PLACE 리뷰: 장소 이미지 + 이름 가로정렬 */}
          {isPlace && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Image
                src={review.placeImageUrl}
                width={60}
                height={60}
                style={{ objectFit: 'cover', borderRadius: 8 }}
              />
              <div>
                <div
                  style={{ fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}
                  onClick={() => router.push(`/place/${review.targetId}`)}
                >
                  {review.placeName}
                </div>
                <div style={{ color: '#999', fontSize: 13 }}>장소 리뷰</div>
              </div>
            </div>
          )}
        </div>

        {/* 리뷰 본문 */}
        <div style={{ marginTop: 8 }}>
          <Rate disabled value={review.rating} style={{ fontSize: 16 }} />
          <span style={{ marginLeft: 12, color: '#aaa', fontSize: 13 }}>{review.createdAt}</span>
          <div style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{review.content}</div>

          {/* 리뷰 이미지 */}
          {review.imageUrl && (
            <div style={{ marginTop: 12, position: 'relative' }}>
              <Image
                src={
                  review.imageUrl.startsWith('http')
                    ? review.imageUrl
                    : `/upload/reviews/${review.imageUrl}`
                }
                width={100}
                height={100}
                style={{ objectFit: 'cover', borderRadius: 6 }}
              />
              {review.imageCount > 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: 4,
                  left: 4,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  fontSize: 12,
                  padding: '2px 6px',
                  borderRadius: 4,
                }}>
                  {review.imageCount}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 날씨 아이콘 */}
        <div style={{ position: 'absolute', top: 16, right: 16 }}>
          {getWeatherImageFileName(review.weatherCondition) ? (
            <img
              src={`/image/weather/${getWeatherImageFileName(review.weatherCondition)}`}
              alt={review.weatherCondition}
              style={{ width: 40, height: 40 }}
            />
          ) : (
            <QuestionOutlined style={{ color: '#aaa', fontSize: 24 }} />
          )}
        </div>

        {/* 수정/삭제 */}
        <div style={{ position: 'absolute', right: 16, bottom: 16, display: 'flex', gap: 12 }}>
          <Button size="small" onClick={() => handleEdit(review.reviewId)}>수정하기</Button>
          <CloseOutlined
            onClick={() => handleDelete(review.reviewId)}
            style={{ cursor: 'pointer', fontSize: 16, color: '#888' }}
          />
        </div>
      </div>
    );
  };

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
