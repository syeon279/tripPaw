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
        width: '100%',
        color: 'black',
        marginTop: '50px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
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


    const rowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        borderRadius: '8px',
        overflow: 'hidden',
        //border: '1px solid #ccc',
    };

    const fieldStyle = {
        flex: 1,
        padding: '12px',
        boxSizing: 'border-box',
    };

    const dividerStyle = {
        width: '1px',
        border: '1px solid rgba(221, 220, 220, 0.9)',
        height: '80px',
        margin: '10px',
    };

    const inputStyle = {
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
        width: '30px',
        //marginRight: '5px',
    }

    const selectStyle = {
        width: '100%',
        padding: '4px',
        borderRadius: '4px',
        backgroundColor: 'transparent',
        border: 'none',
        borderBottom: '1px solid #ccc',
        padding: '4px 0',
        fontSize: '14px',
        appearance: 'none',         // 브라우저 기본 스타일 제거
        WebkitAppearance: 'none',   // 사파리용
        MozAppearance: 'none',      // 파이어폭스용
    }

    return (
        <div style={containerStyle}>
            <img src="/image/background/main.png" alt="background" style={backgroundStyle} />
            <div style={overlayStyle} />

            <div style={contentStyle}>
                <div style={{ width: '80%' }}>
                    <Image src="/image/logo/TripPaw-logo-white.png" alt="logo" width={450}
                        height={120}
                        priority />
                    <div style={boxStyle}>
                        <div style={rowStyle}>
                            {/* 여행지 */}
                            <div style={fieldStyle}>
                                <label style={{ fontSize: '14px', marginBottom: '10px', display: 'block' }}>여행지</label>
                                <select style={selectStyle}>
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

                            <div style={dividerStyle} />

                            {/* 여행 일자 */}
                            <div style={fieldStyle}>
                                <label style={{ fontSize: '14px', marginBottom: '10px', display: 'block' }}>여행 일자</label>
                                <select style={selectStyle}>
                                    <option>힐링</option>
                                    <option>액티비티</option>
                                    <option>문화탐방</option>
                                </select>
                            </div>

                            <div style={dividerStyle} />

                            {/* 동행 */}
                            <div style={fieldStyle}>
                                <label style={{ fontSize: '14px', marginBottom: '10px', display: 'block' }}>동행</label>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '3%' }}>
                                    <input style={inputStyle} type="number" /> 명
                                    <div style={{
                                        width: '1px',
                                        border: '1px solid rgba(221, 220, 220, 0.9)',
                                        height: '30px',
                                        margin: '10px',
                                    }}></div>
                                    <input style={inputStyle} type="number" /> 견
                                </div>
                                <div>
                                </div>
                            </div>

                            <div style={dividerStyle} />

                            {/* 여행 목적 */}
                            <div style={fieldStyle}>
                                <label style={{ fontSize: '14px', marginBottom: '10px', display: 'block' }}>여행 테마</label>
                                <select style={selectStyle}>

                                </select>
                            </div>

                            <div style={{ marginRight: '100px' }}>

                            </div>


                            {/* 버튼 */}
                            <div style={fieldStyle}>
                                <button
                                    style={{
                                        backgroundColor: 'rgba(12, 147, 151, 0.9)',
                                        color: 'white',
                                        padding: '8px 24px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        marginTop: '20px',
                                        width: '80%',
                                    }}
                                >
                                    여행 추천받기
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default tripPlanMain;