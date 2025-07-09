import React, { useState } from 'react';
import axios from 'axios';
import PublicConfirmModal from './PublicConfirmModal';

const bottonWrapperStyle = {
    width: '100%',
    margin: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: 'none',
};

const bottonStyle = {
    margin: '6px',
    width: '80%',
    height: '50px',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1.5em',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
};

const ActionButtons = ({ tripPlanId, onSave, onEdit, myTrip }) => {
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleConfirm = async () => {
        try {
            await axios.put(`http://localhost:8080/tripPlan/${tripPlanId}/public`);
            alert('공개로 전환되었습니다.');
            onSave?.(); // 추가 처리 필요 시 외부 콜백 호출
        } catch (err) {
            console.error('공개 전환 실패:', err);
            const message = err.response?.data || '서버 오류로 공개 전환에 실패했습니다.';
            alert(message);
        } finally {
            setShowModal(false);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    return (
        <div style={bottonWrapperStyle}>
            {myTrip ? (
                <>
                    <button
                        style={{ ...bottonStyle, background: 'black' }}
                        onClick={handleOpenModal}
                    >
                        다른 사람에게 공유하기
                    </button>
                    {showModal && (
                        <PublicConfirmModal
                            onCancel={handleCancel}
                            onConfirm={handleConfirm}
                        />
                    )}
                </>
            ) : (
                <button
                    style={{ ...bottonStyle, background: 'black' }}
                    onClick={onSave}
                >
                    내 여행으로 저장하기
                </button>
            )}
        </div>
    );
};

export default ActionButtons;
