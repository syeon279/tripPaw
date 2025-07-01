import React from 'react';
import Image from 'next/image';

const tripPlanMain = () => {
    const containerStyle = {
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
    };

    const backgroundStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 0,
    };

    const overlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(182, 182, 182, 0.3)',
        zIndex: 1,
    };

    const contentStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        color: 'white',
        textAlign: 'center',
    };

    const boxStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '24px',
        borderRadius: '16px',
        maxWidth: '960px',
        width: '100%',
        color: 'black',
        marginTop: '50px',
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '16px',
    };

    const tagStyle = {
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '14px',
        marginRight: '8px',
        display: 'inline-block',
    };

    return (
        <div style={containerStyle}>
            <img src="/image/background/main.png" alt="background" style={backgroundStyle} />
            <div style={overlayStyle} />

            <div style={contentStyle}>
                <div style={{ width: '100%', maxWidth: '960px' }}>
                    <Image src="/image/logo/TripPaw-logo-white.png" alt="logo" width={450}
                        height={120}
                        priority />
                    <div style={boxStyle}>
                        <div style={gridStyle}>
                            <div>
                                <label style={{ fontSize: '14px', marginBottom: '4px', display: 'block' }}>지역 선택</label>
                                <select style={{ width: '100%', padding: '4px', borderRadius: '4px' }}>
                                    <option>서울</option>
                                    <option>부산</option>
                                    <option>제주</option>
                                    <option>인천</option>
                                    <option>광주</option>
                                    <option>대전</option>
                                    <option>울산</option>
                                    <option>경기</option>
                                    <option>강원</option>
                                    <option>충청</option>
                                    <option>전라</option>
                                    <option>경북</option>
                                    <option>경상</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '14px', marginBottom: '4px', display: 'block' }}>여행 목적</label>
                                <select style={{ width: '100%', padding: '4px', borderRadius: '4px' }}>
                                    <option>힐링</option>
                                    <option>액티비티</option>
                                    <option>문화탐방</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '14px', marginBottom: '4px', display: 'block' }}>동행</label>
                                <div>
                                    <input style={{ width: '60px', marginRight: '4px' }} type="number" /> 명
                                    <input style={{ width: '60px', marginLeft: '12px', marginRight: '4px' }} type="number" /> 견

                                </div>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <button
                                style={{
                                    backgroundColor: '#2DD4BF',
                                    color: 'white',
                                    padding: '8px 24px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                }}
                            >
                                여행 추천받기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default tripPlanMain;
