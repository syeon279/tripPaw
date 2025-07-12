import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { submitPassportSeal } from '@/api/passportSealApi';

const SealSelectorModal = ({ passportId, review, memberTripPlanId, onClose, onSaved }) => {
  const [seals, setSeals] = useState([]);
  const [selectedSealId, setSelectedSealId] = useState(null);

  useEffect(() => {
    console.log('memberTripPlanId...:', memberTripPlanId, 'passportId...:', passportId);
    if (memberTripPlanId && passportId) {
      axios.get(`/api/seals/tripplan/${memberTripPlanId}/passport/${passportId}`)
        .then((res) => setSeals(res.data))
        .catch((err) => console.error('도장 조회 실패:', err));
    }
  }, [memberTripPlanId, passportId]);

const handleSubmit = async () => {
  if (!selectedSealId) {
    alert('도장을 선택해주세요.');
    return;
  }

  try {
    await submitPassportSeal(passportId, selectedSealId, review.id); // ✅ API 함수 사용
    onSaved();
    onClose();
  } catch (error) {
    console.error('도장 등록 실패:', error);
    alert('도장 등록 중 오류가 발생했습니다.');
  }
};

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>도장 선택</h3>
        {seals.length > 0 ? (
          <div className="seal-grid">
            {seals.map((seal) => (
              <div
                key={seal.id}
                className={`seal-card ${selectedSealId === seal.id ? 'selected' : ''}`}
                onClick={() => setSelectedSealId(seal.id)}
              >
                <img src={seal.imageUrl} alt={seal.name} />
                <p>{seal.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>해당 장소 유형에 맞는 도장이 없습니다.</p>
        )}

        <button onClick={handleSubmit}>도장 등록하기</button>
        <button onClick={onClose}>취소</button>

        <style jsx>{`
          .seal-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 12px;
          }

          .seal-card {
            border: 1px solid #ccc;
            padding: 8px;
            cursor: pointer;
            border-radius: 6px;
            text-align: center;
          }

          .seal-card.selected {
            border-color: #0078D4;
            background-color: #eef6ff;
          }

          .seal-card img {
            max-width: 80px;
            height: auto;
            border-radius: 6px;
          }
        `}</style>
      </div>
    </div>
  );
};

export default SealSelectorModal;
