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

const TripPlanToMyTrip = ({
    onClose,
    onSave,
    defaultStartDate,
    defaultEndDate,
    defaultCountPeople,
    defaultCountPet,
    onCaptureMap,
}) => {
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState(defaultStartDate || '');
    const [endDate, setEndDate] = useState(defaultEndDate || '');
    const [countPeople, setCountPeople] = useState(defaultCountPeople || 1);
    const [countPet, setCountPet] = useState(defaultCountPet || 0);

    const handleSave = async () => {
        if (!title.trim()) {
            alert('여행 제목을 입력해주세요.');
            return;
        }

        if (!startDate || !endDate) {
            alert('여행 일정을 입력해주세요.');
            return;
        }

        let mapImageBase64 = null;

        try {
            mapImageBase64 = await onCaptureMap?.();
        } catch (err) {
            console.warn('지도 캡처 실패:', err);
        }

        const travelData = {
            title,
            startDate,
            endDate,
            countPeople,
            countPet,
            mapImage: mapImageBase64,
        };

        const result = await onSave(travelData);
        if (result) {
            onClose();  // ✅ 저장 성공 시에만 모달 닫기
        }
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <h2 style={{ marginBottom: '16px' }}>내 여행으로 저장하기</h2>

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

                <label>시작일</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ width: '100%', marginBottom: '12px', padding: '6px' }}
                />

                <label>종료일</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{ width: '100%', marginBottom: '12px', padding: '6px' }}
                />

                <label>동행 인원</label>
                <input
                    type="number"
                    value={countPeople}
                    min={1}
                    onChange={(e) => setCountPeople(Number(e.target.value))}
                    style={{ width: '100%', marginBottom: '12px', padding: '6px' }}
                />

                <label>반려동물 수</label>
                <input
                    type="number"
                    value={countPet}
                    min={0}
                    onChange={(e) => setCountPet(Number(e.target.value))}
                    style={{ width: '100%', marginBottom: '16px', padding: '6px' }}
                />

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

export default TripPlanToMyTrip;
