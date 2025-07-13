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
    <div style={{padding:'10px'}}>
      <h2  style={{ marginBottom: 16, fontSize:'24px', fontWeight:'bold', color:'#653131', borderBottom:'2px solid #653131', paddingBottom:'12px', marginBottom:'12px' }}>내 반려동물 여권</h2>
      <div style={{textAlign:'end'}}><button style={{fontWeight:'bold', border:'2px solid #1a2f69', borderRadius:'5px', padding:'5px 12px', backgroundColor:'#fff', cursor:'pointer'}}
      onClick={() => { setSelectedPassport(null); setShowEditorModal(true);}}> 여권 생성</button></div>

      <div className="passport-grid">
        {passports.map((passport) => (
          <div key={passport.id} className="passport-card" onClick={() => handleCardClick(passport)} >
          <div style={{textAlign:'end', width:'200px', height:'260px'}}>
            
            <img
              src={ passport.imageUrl?.startsWith('http') ? passport.imageUrl : `http://localhost:8080${passport.imageUrl}` }
              alt={passport.petName}/>
            <h1 style={{color:'#fff', fontSize:'24px', margin:'20px 0 4px'}}>동물왕국 여권</h1>
            <div style={{display:'flex', justifyContent:'flex-end', gap:'10px', marginBottom:'32px'}}>
              <p style={{color:'#fff'}}>{passport.species} · {passport.petAge}살 · {passport.petGender}</p>
              <p style={{color:'#fff', fontWeight:'bold'}}>{passport.petName}</p>
            </div>
            {/* <p>여권번호: {passport.passNum}</p> */}

          </div>

            <div style={{display:'flex', justifyContent:'space-between', gap:'8px'}}>
              <button style={{fontWeight:'bold', fontSize:'16px', width:'100%', backgroundColor:'#1A2E69', border:'2px solid #fff', color:'#fff', borderRadius:'3px', cursor:'pointer'}}
              onClick={(e) => { e.stopPropagation(); handleEdit(passport); }}>수정</button>
              <button  style={{fontWeight:'bold', fontSize:'16px', width:'100%', backgroundColor:'#fff', border:'none', color:'#ff0000', borderRadius:'3px', cursor:'pointer'}}
              onClick={(e) => { e.stopPropagation(); handleDelete(passport.id); }}>삭제</button>
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
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 36px;
          width:100%;
        }

        .passport-card {
          border: 1px solid #ccc;
          border-radius: 6px;
          padding: 36px 32px;
          cursor: pointer;
          transition: box-shadow 0.2s ease;
          background-color: #1A2E69;
        }

        .passport-card img {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 100%;
        }


      `}</style>
    </div>
  );
};

export default PassportCardList;
