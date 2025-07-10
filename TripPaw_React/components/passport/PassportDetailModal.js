import React, { useEffect, useState } from 'react';
import { getPassportWithSeals } from '@/api/passportApi';

const PassportDetailModal = ({ passport, onClose }) => {
  const [fullPassport, setFullPassport] = useState(null);

  useEffect(() => {
    if (passport) {
      getPassportWithSeals(passport.id).then((res) => setFullPassport(res.data));
    }
  }, [passport]);

  if (!fullPassport) return null;

  const { petName, species, petAge, petGender, passNum, imageUrl, passportSeals } = fullPassport;

  return (
    <>
      <style>{`
        .passport-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }

        .passport-modal {
          background: #fff;
          width: 480px;
          max-width: 90%;
          padding: 24px;
          border-radius: 10px;
          position: relative;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .passport-modal h3 {
          margin-top: 0;
        }

        .passport-close {
          position: absolute;
          top: 12px; right: 16px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }

        .passport-header img {
          width: 100%;
          max-height: 240px;
          object-fit: cover;
          border-radius: 8px;
        }

        .stamp-list {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 16px;
        }

        .stamp-list img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          cursor: pointer;
          border-radius: 6px;
        }
      `}</style>

      <div className="passport-overlay">
        <div className="passport-modal">
          <button className="passport-close" onClick={onClose}>×</button>

          <h3>{petName}의 반려동물 여권</h3>
          <div className="passport-header">
            <img
              src={
                imageUrl?.startsWith('http')
                  ? imageUrl
                  : `http://localhost:8080${imageUrl}`
              }
              alt={petName}
            />
          </div>

          <p><strong>종:</strong> {species}</p>
          <p><strong>나이:</strong> {petAge}살</p>
          <p><strong>성별:</strong> {petGender}</p>
          <p><strong>여권번호:</strong> {passNum}</p>

          <h4>도장 목록</h4>
          {passportSeals.length > 0 ? (
            <div className="stamp-list">
              {passportSeals.map((seal) => (
                <a href={`/reviews/${seal.reviewId}`}>
                  <img
                    key={seal.id}
                    src={
                      seal.imageUrl?.startsWith('http')
                        ? seal.imageUrl
                        : `http://localhost:8080${seal.imageUrl}`
                    }
                    alt="도장"
                  />
                </a>
              ))}
            </div>
          ) : (
            <p>아직 도장이 없습니다.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PassportDetailModal;
