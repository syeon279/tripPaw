import React, { useState } from 'react';
import axios from 'axios';
import PublicConfirmModal from './PublicConfirmModal';
import TripPlanToMyTrip from './TripPlanToMyTrip'; // ⭐ 추가

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

const SearchTripPlanActionButton = ({
    tripPlanId,
    onSave,
    onEdit,
    myTrip,
    startDate,
    endDate,
    countPeople,
    countPet,
    onCaptureMap,
    myId
}) => {
    const [showModal, setShowModal] = useState(false);
    const [showMyTripModal, setShowMyTripModal] = useState(false); // ⭐ 추가

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleConfirm = async () => {
        try {
            await axios.put(`http://localhost:8080/tripPlan/${tripPlanId}/public`);
            alert('공개로 전환되었습니다.');
            onSave?.();
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

    const handleSaveMyTrip = () => {
        setShowMyTripModal(true);
    };

    const handleCloseMyTripModal = () => {
        setShowMyTripModal(false);
    };

    // 내 여행으로 저장하기
    const handleConfirmSave = async (travelData) => {
        try {
            const response = await axios.post(
                `http://localhost:8080/memberTripPlan/save`,
                {
                    memberId: myId, // 로그인 유저의 ID
                    tripPlanId: tripPlanId,
                    startDate: travelData.startDate,
                    endDate: travelData.endDate,
                    countPeople: travelData.countPeople,
                    countPet: travelData.countPet,
                    titleOverride: travelData.title,
                }
            );
            alert('저장되었습니다.');
        } catch (err) {
            console.error('저장 실패:', err);
            const msg = err.response?.data || '서버 오류로 저장 실패';
            alert(msg);
        }
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
                <>
                    <button
                        style={{ ...bottonStyle, background: 'black' }}
                        onClick={handleSaveMyTrip}
                    >
                        내 여행으로 저장하기
                    </button>
                    {showMyTripModal && (
                        <TripPlanToMyTrip
                            onClose={handleCloseMyTripModal}
                            onSave={handleConfirmSave}
                            defaultStartDate={startDate}
                            defaultEndDate={endDate}
                            defaultCountPeople={countPeople}
                            defaultCountPet={countPet}
                            onCaptureMap={onCaptureMap}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default SearchTripPlanActionButton;
