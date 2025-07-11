//등록/수정 모달
import React, { useEffect, useState } from 'react';
import {  createPassport,  updatePassport,  checkPassNumDuplicate,} from '@/api/passportApi';
import axios from 'axios';

const PassportEditorModal = ({ passport, onClose, onSaved, memberId  }) => {
  const [form, setForm] = useState({
    petName: '',
    species: '',
    petAge: '',
    petGender: '',
    imageUrl: '',
    passNum: '',
    member: { id: memberId  }, 
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isPassNumValid, setIsPassNumValid] = useState(true);

  useEffect(() => {
    if (passport) {
      setForm(passport);

      const fullUrl = passport.imageUrl?.startsWith('http')
        ? passport.imageUrl
        : `http://localhost:8080${passport.imageUrl}`;

      setPreviewUrl(fullUrl);
    }
  }, [passport]);

  useEffect(() => {
    if (form.passNum) {
      checkPassNumDuplicate(form.passNum).then((res) => {
        setIsPassNumValid(!res.data);      });
    }
  }, [form.passNum]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!imageFile) return form.imageUrl;

    const formData = new FormData();
    formData.append('file', imageFile);

    const res = await axios.post('/api/seal-uploads/image', formData);
    return res.data;
  };

  const handleSubmit = async () => {
    const finalImageUrl = await uploadImage();

    const passportData = {
      ...form,
      imageUrl: finalImageUrl,
    };

    const action = passport
      ? updatePassport(passport.id, passportData)
      : createPassport(passportData);

    action.then(() => { onSaved(); onClose(); });
  };

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
          background: white;
          padding: 24px;
          border-radius: 10px;
          width: 400px;
          max-width: 90vw;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          position: relative;
        }

        .passport-close {
          position: absolute;
          top: 12px;
          right: 16px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }

        .passport-modal label {
          display: block;
          margin-top: 12px;
          font-weight: bold;
        }

        .passport-modal input,
        .passport-modal select {
          width: 100%;
          padding: 6px;
          margin-top: 4px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }

        .passport-modal button {
          margin-top: 16px;
          margin-right: 8px;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          background-color: #0078D4;
          color: white;
          cursor: pointer;
        }

        .passport-modal button:last-child {
          background-color: #666;
        }

        .passport-modal img {
          margin-top: 8px;
          max-width: 100px;
          border: 1px solid #eee;
        }

        .invalid {
          color: red;
          font-size: 12px;
        }
      `}</style>

      <div className="passport-overlay">
        <div className="passport-modal">
          <button className="passport-close" onClick={onClose}>×</button>

          <h3>{passport ? '여권 수정' : '여권 등록'}</h3>

          <label>반려동물 이름</label>
          <input name="petName" value={form.petName} onChange={handleChange} />

          <label>종(species)</label>
          <input name="species" value={form.species} onChange={handleChange} />

          <label>나이</label>
          <input name="petAge" type="number" value={form.petAge} onChange={handleChange} />

          <label>성별</label>
          <select name="petGender" value={form.petGender} onChange={handleChange}>
            <option value="">선택</option>
            <option value="암컷">암컷</option>
            <option value="수컷">수컷</option>
          </select>

          {/* <label>여권번호</label>
          <input name="passNum" value={form.passNum} onChange={handleChange} />
          {!isPassNumValid && !passport && (
            <div className="invalid">이미 사용 중인 여권번호입니다.</div>
          )} */}

          <label>이미지 업로드</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {previewUrl && (
            <img src={previewUrl} alt="미리보기" />
          )}

          <button onClick={handleSubmit}>저장</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </>
  );
};

export default PassportEditorModal;
