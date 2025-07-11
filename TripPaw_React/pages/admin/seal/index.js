import React, { useEffect, useState } from 'react';
import { fetchAllSeals, deleteSeal } from '@/api/sealApi';
import SealTable from '@/components/seal/SealTable';
import SealEditorModal from '@/components/seal/SealEditorModal';
import MypageLayout from '@/components/layout/MyPageLayOut';

const SealAdminPage = () => {
  const [seals, setSeals] = useState([]);
  const [selectedSeal, setSelectedSeal] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadSeals = () => {
    fetchAllSeals().then(res => setSeals(res.data));
  };

  useEffect(() => { loadSeals(); }, []);
  useEffect(() => {
    console.log('[Seals]', seals);
    seals.forEach(seal => {
      console.log(`[이미지 src] [${seal.imageUrl}]`);
    });
  }, [seals]);

  const handleEdit = (seal) => {
    setSelectedSeal(seal);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      deleteSeal(id).then(loadSeals);
    }
  };

  return (
    <MypageLayout>
      <div style={{padding:'2em'}}>
      <h2>도장 관리</h2>
      <button onClick={() => { setSelectedSeal(null); setShowModal(true); }}>
        도장 추가
      </button>
      <SealTable seals={seals} onEdit={handleEdit} onDelete={handleDelete} />
      {showModal && (
        <SealEditorModal
          seal={selectedSeal}
          onClose={() => setShowModal(false)}
          onSaved={loadSeals}
        />
      )}
      </div>
    </MypageLayout>
  );
};

export default SealAdminPage;
