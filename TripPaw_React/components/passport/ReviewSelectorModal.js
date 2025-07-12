import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SealSelectorModal from './SealSelectorModal'; // 필요 시 컴포넌트 경로 맞게 조정

const ReviewSelectorModal = ({ memberId, passportId, onClose, onSaved }) => {
  const [reviews, setReviews] = useState([]);
  const [reservsNoReview, setReservsNoReview] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    axios.get(`/review/member/${memberId}/place-type`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error('작성된 리뷰 조회 실패:', err));

    axios.get(`/review/tripplans-no-review/${memberId}`)
      .then((res) => setReservsNoReview(res.data))
      .catch((err) => console.error('작성 안한 여행 조회 실패:', err));
  }, [memberId]);

const handleReviewSelect = (item) => {
  let memberTripPlanId;

  if (item.isUnwritten) {
    // 작성 안 된 예약 기반 → 예약 객체에서 추출
    memberTripPlanId = item?.reserv?.memberTripPlan?.id;

    setSelectedReview({
      ...item,
      memberTripPlanId,
    });
  } else {
    // 작성된 리뷰 → 예약 안에 memberTripPlan 없는 경우 fallback 필요
    memberTripPlanId = item?.reserv?.memberTripPlan?.id ?? item?.targetId;
    const reviewId = item?.reviewId || item?.id;

    setSelectedReview({
      ...item,
      id: reviewId, // ✅ reviewId를 실제 id로 재정의해줍니다
      memberTripPlanId,
    });
  }
};

useEffect(() => {
  console.log('선택된 리뷰:', selectedReview);
  console.log('추출된 memberTripPlanId:', selectedReview?.memberTripPlanId);
}, [selectedReview]);

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          width: 100%;
          max-width: 640px;
          height: 90vh;
          background: #fff;
          overflow-y: auto;
          padding: 24px;
          box-sizing: border-box;
          border-radius: 8px;
        }
        .review-card {
          border: 1px solid #ccc;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: background-color 0.2s ease-in-out;
        }
        .review-card:hover {
          background-color: #f9f9f9;
        }
      `}</style>

      <div className="modal-overlay">
        <div className="modal-content">
          <h3 style={{ marginBottom: '16px' }}>도장 연결할 리뷰 선택</h3>

          {[...reviews, ...reservsNoReview.map(r => ({ reserv: r, isUnwritten: true }))].map((item, index) => (
            <div key={index} className="review-card">
              {item.isUnwritten ? (
                <>
                  <p><strong>{item.reserv.titleOverride || '제목 없음'}</strong> ({item.reserv.startDate} ~ {item.reserv.endDate})</p>
                  <small>아직 리뷰가 작성되지 않았습니다</small><br />
                  <button onClick={() => window.location.href = `/write-review?reservId=${item.reserv.id}`}>
                    리뷰 작성하러 가기
                  </button>
                </>
              ) : (
                <>
                  <p><strong>{item.content}</strong></p>
                  <p>날씨: {item.weatherCondition} / 평점: {item.rating}</p>
                  <small>작성일: {item.createdAt}</small><br />
                  <button onClick={() => handleReviewSelect(item)}>도장 연결</button>
                </>
              )}
            </div>
          ))}

          {selectedReview && (
            <SealSelectorModal
              passportId={passportId}
              review={selectedReview}
              memberTripPlanId={selectedReview?.memberTripPlanId}
              onClose={() => setSelectedReview(null)}
              onSaved={onSaved}
            />
          )}

          <button onClick={onClose} style={{ marginTop: '24px' }}>닫기</button>
        </div>
      </div>
    </>
  );
};

export default ReviewSelectorModal;
