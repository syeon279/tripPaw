import React, { useState } from 'react';

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const modalStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    width: '400px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
};

const TitleModal_my = ({ onClose, onSave, defaultStartDate, defaultEndDate, defaultCountPeople, defaultCountPet }) => {
    const [title, setTitle] = useState('');

    const handleSave = () => {
        if (!title.trim()) {
            alert('여행 제목을 입력해주세요.');
            return;
        }

        onSave({
            title,
            startDate: defaultStartDate,
            endDate: defaultEndDate,
            countPeople: defaultCountPeople,
            countPet: defaultCountPet,
        });
        onClose();
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <h2 style={{ marginBottom: '16px' }}>여행 제목 설정</h2>

                <label style={{ display: 'block', marginBottom: '8px' }}>제목</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="예: 제주도 힐링 여행"
                    style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '16px',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                    }}
                />

                <div style={{ marginBottom: '12px', fontSize: '14px', color: '#555' }}>
                    <div>📅 {defaultStartDate} ~ {defaultEndDate}</div>
                    <div>👤 동행 {defaultCountPeople} 명   |   {defaultCountPet} 견 </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <button onClick={onClose} style={{ marginRight: '8px' }}>취소</button>
                    <button
                        onClick={handleSave}
                        style={{
                            backgroundColor: '#0077ff',
                            color: 'white',
                            padding: '6px 12px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                        }}
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TitleModal_my;
