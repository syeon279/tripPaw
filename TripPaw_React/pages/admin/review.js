import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tabs, Card, Rate, Image, Button, Popconfirm, message } from 'antd';
import MypageLayout from '@/components/layout/MyPageLayout';

const { TabPane } = Tabs;

const ReviewCard = ({ review, onDelete }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`/review/${review.reviewId}`);
      message.success('리뷰가 삭제되었습니다.');
      onDelete(); // 삭제 후 목록 갱신
    } catch (err) {
      console.error(err);
      message.error('리뷰 삭제 실패');
    }
  };

  return (
    <Card
      title={review.memberNickname}
      style={{ marginBottom: 16 }}
      extra={
        <Popconfirm
          title="정말 이 리뷰를 삭제하시겠습니까?"
          onConfirm={handleDelete}
          okText="예"
          cancelText="아니오"
        >
          <Button danger size="small">삭제</Button>
        </Popconfirm>
      }
    >
      <p>
        <strong>{review.planTitle ? '플랜명' : '장소명'}:</strong>{' '}
        {review.planTitle || review.placeName}
      </p>
      <p><strong>좋아요:</strong> {review.likeCount}</p>
      <p><strong>별점:</strong> <Rate disabled value={review.rating} /></p>
      <p><strong>날씨:</strong> {review.weatherCondition}</p>
      <p><strong>내용:</strong> {review.content}</p>
      
      {review.imageUrls &&
        review.imageUrls.split(',').map((url, idx) => (
          <Image
            key={idx}
            src={url}
            alt="review"
            width={100}
            style={{ marginRight: 8 }}
          />
        ))}
    </Card>
  );
};

const ReviewAdminPage = () => {
  const [planReviews, setPlanReviews] = useState([]);
  const [placeReviews, setPlaceReviews] = useState([]);

  useEffect(() => {
    fetchPlanReviews();
    fetchPlaceReviews();
  }, []);

  const fetchPlanReviews = async () => {
    try {
      const res = await axios.get('/review/admin/plan');
      setPlanReviews(res.data);
    } catch (err) {
      console.error('경로 리뷰 불러오기 실패', err);
    }
  };

  const fetchPlaceReviews = async () => {
    try {
      const res = await axios.get('/review/admin/place');
      setPlaceReviews(res.data);
    } catch (err) {
      console.error('장소 리뷰 불러오기 실패', err);
    }
  };

  return (
    <MypageLayout>
      <div style={{ maxWidth: 1000, margin: '40px auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: 20 }}>
          관리자 리뷰 관리
        </h1>
        <Tabs defaultActiveKey="plan">
          <TabPane tab="경로 리뷰" key="plan">
            {planReviews.map((review) => (
              <ReviewCard
                key={review.reviewId}
                review={review}
                onDelete={fetchPlanReviews}
              />
            ))}
          </TabPane>
          <TabPane tab="장소 리뷰" key="place">
            {placeReviews.map((review) => (
              <ReviewCard
                key={review.reviewId}
                review={review}
                onDelete={fetchPlaceReviews}
              />
            ))}
          </TabPane>
        </Tabs>
      </div>
    </MypageLayout>
  );
};

export default ReviewAdminPage;
