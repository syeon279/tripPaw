// components/tripPlan/RouteMap.js
import React, { useEffect, useRef, useState } from 'react';

const RouteMap = ({ places, style }) => {
    const mapRef = useRef(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!places || places.length === 0) return;

        const waitForKakao = setInterval(() => {
            if (window.kakao && window.kakao.maps) {
                clearInterval(waitForKakao);
                setLoaded(true);
            }
        }, 100);

        return () => clearInterval(waitForKakao);
    }, []);

    useEffect(() => {
        if (!loaded) return;

        const container = mapRef.current;
        const options = {
            center: new window.kakao.maps.LatLng(places[0].latitude, places[0].longitude),
            level: 6,
        };

        const map = new window.kakao.maps.Map(container, options);

        const path = [];

        places.forEach((place, idx) => {
            const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);
            path.push(position);

            new window.kakao.maps.Marker({
                map,
                position,
                title: `${idx + 1}. ${place.name}`,
            });
        });

        new window.kakao.maps.Polyline({
            map,
            path,
            strokeWeight: 4,
            strokeColor: '#0077ff',
            strokeOpacity: 0.7,
            strokeStyle: 'solid',
        });
    }, [loaded, places]);

    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

export default RouteMap;
