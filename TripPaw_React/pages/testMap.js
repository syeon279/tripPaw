import React, { useEffect, useRef } from 'react';

const TestMap = () => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) return;
        console.log("카카오 스크립트 로딩됨");
        console.log("맵 div ref:", mapRef.current);
        console.log("카카오 객체:", window.kakao);

        const loadMap = () => {
            window.kakao.maps.load(() => {
                const map = new window.kakao.maps.Map(mapRef.current, {
                    center: new window.kakao.maps.LatLng(37.5665, 126.978),
                    level: 3,
                });

                new window.kakao.maps.Marker({
                    position: new window.kakao.maps.LatLng(37.5665, 126.978),
                    map,
                });
            });
        };

        if (!window.kakao || !window.kakao.maps) {
            const script = document.createElement('script');
            script.src =
                'https://dapi.kakao.com/v2/maps/sdk.js?appkey=dd83c711edfa536595c191a7a73247a9&autoload=false';
            script.onload = loadMap;
            document.head.appendChild(script);
        } else {
            loadMap();
        }
    }, []);

    return (
        <div>
            <h1>테스트 맵</h1>
            <div
                ref={mapRef}
                style={{ width: '100%', height: '500px', border: '1px solid #000' }}
            />
        </div>
    );
};

export default TestMap;
