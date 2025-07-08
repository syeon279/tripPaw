import React from 'react';

const bottonWrapperStyle = {
    //border: '2px solid purple',
    width: '100%',
    margin: '10px',
    display: 'flex',
    flexDirection: 'column',   // 세로 정렬
    alignItems: 'center',
    border: 'none',
}


const bottonStyle = {
    //border: '2px solid red',
    margin: '6px',
    width: '80%',
    height: '50px',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1.5em',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',

}

const ActionButtons = ({ onReserv, onEdit, isMyTrip }) => {
    return (
        <div style={bottonWrapperStyle}>
            <button style={{ ...bottonStyle, background: 'blue' }}
                onClick={onEdit}>
                경로 수정하기
            </button>
            <button
                style={{ ...bottonStyle, background: 'black' }}
                onClick={onReserv}
            >
                이대로 예약하기
            </button>
            {/* ✅ 내 여행일 때만 리뷰쓰기 버튼 노출 */}
            {isMyTrip && (
                <button
                    style={{ ...bottonStyle, background: 'green' }}
                //onClick={onWriteReview}
                >
                    리뷰 쓰기
                </button>
            )}
        </div>
    );
};

export default ActionButtons;