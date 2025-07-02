import React from 'react';
import Image from 'next/image';

const TripPlanSearch = () => {
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
            <img src="/image/background/main_search.png" alt="background" style={backgroundStyle} />
            <div style={overlayStyle} />

            <div style={contentStyle}>
                <div style={{ width: '100%', maxWidth: '960px' }}>
                    <Image src="/image/logo/TripPaw-logo-white.png" alt="logo" width={450}
                        height={120}
                        priority />
                    <div style={boxStyle}>
                        <div>
                            <input style={{ width: '500px', height: '50px', marginLeft: '12px', marginRight: '4px' }} type="string" placeholder=' 검색어를 입력해주세요' />
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

export default TripPlanSearch;
