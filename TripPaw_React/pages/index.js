import React from 'react';

const Home = () => {
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
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
                    <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <span style={{ marginRight: '8px' }}>Trip</span>
                        <span>Paw</span>
                        <span style={{ marginLeft: '8px', fontSize: '24px' }}>🐾</span>
                    </h1>

                    <div style={boxStyle}>
                        <div style={gridStyle}>
                            <div>
                                <label style={{ fontSize: '14px', marginBottom: '4px', display: 'block' }}>지역 선택</label>
                                <select style={{ width: '100%', padding: '4px', borderRadius: '4px' }}>
                                    <option>서울</option>
                                    <option>부산</option>
                                    <option>제주</option>
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
                                <select style={{ width: '100%', padding: '4px', borderRadius: '4px' }}>
                                    <option>혼자</option>
                                    <option>반려견</option>
                                    <option>가족</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '14px', marginBottom: '4px', display: 'block' }}>날씨 조건</label>
                                <div>
                                    <span style={{ ...tagStyle, backgroundColor: '#FFEDD5', color: '#C2410C' }}>맑음</span>
                                    <span style={{ ...tagStyle, backgroundColor: '#DBEAFE', color: '#1E3A8A' }}>흐림</span>
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

export default Home;
