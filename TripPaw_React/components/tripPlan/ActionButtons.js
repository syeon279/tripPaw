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
    width: '90%',
    height: '80px',
    justifyContent: 'center',
    color: 'white',
    fontSize: '2em',
    border: 'none',
    fontWeight: 'bold',
}

const ActionButtons = () => {
    return (
        <div style={bottonWrapperStyle}>
            <button style={{ ...bottonStyle, background: 'blue' }}>
                경로 수정하기
            </button>
            <button style={{ ...bottonStyle, background: 'black' }}>
                이대로 예약하기
            </button>
        </div>
    );
};

export default ActionButtons;