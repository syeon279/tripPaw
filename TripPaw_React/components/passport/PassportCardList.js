import React, { useEffect, useState } from 'react';
import {  getPassportsByMemberId,  deletePassport,} from '@/api/passportApi';
import PassportDetailModal from '@/components/passport/PassportDetailModal';
import PassportEditorModal from '@/components/passport/PassportEditorModal';

const PassportCardList = ({ memberId }) => {
  const [passports, setPassports] = useState([]);
  const [selectedPassport, setSelectedPassport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditorModal, setShowEditorModal] = useState(false);

  const fetchPassports = () => {
    getPassportsByMemberId(memberId).then((res) => setPassports(res.data));
  };

  useEffect(() => {    fetchPassports();  }, []);

  const handleEdit = (passport) => {
    setSelectedPassport(passport);
    setShowEditorModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await deletePassport(id);
      fetchPassports();
    }
  };

  const handleCardClick = (passport) => {
    setSelectedPassport(passport);
    setShowDetailModal(true);
  };

  return (
    <div>
      <h2>내 반려동물 여권</h2>
      <button
        onClick={() => {
          setSelectedPassport(null);
          setShowEditorModal(true);
        }}
      >
        여권 생성
      </button>

      <div className="passport-grid">
        {passports.map((passport) => (
          <div
            key={passport.id}
            className="passport-card"
            onClick={() => handleCardClick(passport)}
          >
            <img
              src={
                passport.imageUrl?.startsWith('http')
                  ? passport.imageUrl
                  : `http://localhost:8080${passport.imageUrl}`
              }
              alt={passport.petName}
            />
            <h3>{passport.petName}</h3>
            <p>{passport.species} · {passport.petAge}살 · {passport.petGender}</p>
            <p>여권번호: {passport.passNum}</p>

            <div className="card-actions">
              <button onClick={(e) => { e.stopPropagation(); handleEdit(passport); }}>수정</button>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(passport.id); }}>삭제</button>
            </div>
          </div>
        ))}
      </div>

      {showEditorModal && (
        <PassportEditorModal
          passport={selectedPassport}
          memberId={memberId} 
          onClose={() => setShowEditorModal(false)}
          onSaved={fetchPassports}
        />
      )}

      {showDetailModal && (
        <PassportDetailModal
          passport={selectedPassport}
          memberId={memberId}
          onClose={() => setShowDetailModal(false)}
        />
      )}

      <style jsx>{`
        .passport-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-top: 24px;
        }

        .passport-card {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 16px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: box-shadow 0.2s ease;
        }

        .passport-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .passport-card img {
          width: 100%;
          height: 140px;
          object-fit: cover;
          border-radius: 6px;
        }

        .card-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
        }

        button {
          background: #0078D4;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
        }

        button:hover {
          background: #005fa3;
        }
      `}</style>
    </div>
  );
};

export default PassportCardList;
