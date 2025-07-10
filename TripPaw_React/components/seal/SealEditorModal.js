import React, { useEffect, useState } from 'react';
import { createSeal, updateSeal } from '@/api/sealApi';
import axios from 'axios';

const dummyPlaceTypes = [
  { id: 1, name: '숙소' },
  { id: 2, name: '카페' },
  { id: 3, name: '공원' },
];

const SealEditorModal = ({ seal, onClose, onSaved }) => {
  const [form, setForm] = useState({
    name: '',
    imageUrl: '',
    placeType: { id: 1 },
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (seal) {
      setForm(seal);
      setPreviewUrl(seal.imageUrl || '');
    }
  }, [seal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceTypeChange = (e) => {
    setForm((prev) => ({
      ...prev,
      placeType: { id: Number(e.target.value) },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file); // 오류 체크용
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // 미리보기 표시
  };

  const uploadImage = async () => {
    if (!imageFile) return form.imageUrl;

    const formData = new FormData();
    formData.append('file', imageFile);

    const res = await axios.post('/api/seal-uploads/image', formData);
    return res.data; 
  };

  const handleSubmit = async () => {
    const finalImageUrl = await uploadImage(); // 새 이미지 업로드 or 기존 유지

    const sealData = {
      ...form,
      imageUrl: finalImageUrl,
    };

    const action = seal
      ? updateSeal(seal.id, sealData)
      : createSeal(sealData);

    action.then(() => {
      onSaved();
      onClose();
    });
  };

  return (
    <div className="modal">
      <h3>{seal ? '도장 수정' : '도장 등록'}</h3>

      <label>이름</label>
      <input name="name" value={form.name} onChange={handleChange} />

      <label>이미지 업로드</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && (
        <img src={previewUrl} alt="미리보기" style={{ width: 80, marginTop: 8 }} />
      )}

      <label>카테고리</label>
      <select value={form.placeType.id} onChange={handlePlaceTypeChange}>
        {dummyPlaceTypes.map((pt) => (
          <option key={pt.id} value={pt.id}>
            {pt.name}
          </option>
        ))}
      </select>

      <button onClick={handleSubmit}>저장</button>
      <button onClick={onClose}>취소</button>
    </div>
  );
};

export default SealEditorModal;
