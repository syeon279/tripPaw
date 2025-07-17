//RouteMap.js
import React, { useEffect, useRef } from 'react';

const RouteMap_my = ({ routeData, style, setMapInstance, focusDay, setFocusDay }) => {
    const mapRef = useRef(null);
    const mapObj = useRef(null);
    const polylineRefs = useRef([]);
    const markerRefs = useRef([]);

    const COLORS = ['#0077ff', '#FF6347', '#32CD32', '#FF8C00', '#8A2BE2', '#00CED1'];

    useEffect(() => {
        if (!window.kakao || !window.kakao.maps || !routeData?.length) return;
        const firstPlace = routeData[0]?.places?.[0];
        if (!firstPlace) return;

        const center = new kakao.maps.LatLng(firstPlace.latitude, firstPlace.longitude);
        mapObj.current = new kakao.maps.Map(mapRef.current, {
            center,
            level: 6,
        });

        setMapInstance?.(mapObj.current);
    }, []);

    // RouteMap.js
    useEffect(() => {
        if (!mapObj.current || !routeData?.length) return;

        // 기존 마커/폴리라인 제거
        polylineRefs.current.forEach((line) => line.setMap(null));
        markerRefs.current.forEach((marker) => marker.setMap(null));
        polylineRefs.current = [];
        markerRefs.current = [];

        const bounds = new kakao.maps.LatLngBounds();
        const visibleRouteData = focusDay
            ? routeData.filter((r) => Number(r.day) === Number(focusDay))
            : routeData;

        visibleRouteData.forEach((dayPlan) => {
            const path = [];
            const color = COLORS[dayPlan.day % COLORS.length];

            dayPlan.places.forEach((place) => {
                const latlng = new kakao.maps.LatLng(place.latitude, place.longitude);
                bounds.extend(latlng);
                path.push(latlng);

                const marker = new kakao.maps.Marker({
                    map: mapObj.current,
                    position: latlng,
                    title: `${dayPlan.day}일차 - ${place.name}`,
                });

                markerRefs.current.push(marker);
            });

            const polyline = new kakao.maps.Polyline({
                map: mapObj.current,
                path,
                strokeWeight: 4,
                strokeColor: color,
                strokeOpacity: 0.8,
                strokeStyle: 'solid',
            });

            polylineRefs.current.push(polyline);
        });

        // ⭐ focusDay가 없을 때만 전체 bounds로 이동
        if (!focusDay) {
            mapObj.current.setBounds(bounds);
        }
    }, [routeData, focusDay]);



    // ✅ 외부 클릭 시 전체 경로 복귀
    useEffect(() => {
        const handleClickOutside = (e) => {
            const clickedInsideMap = mapRef.current?.contains(e.target);
            const clickedInsideSchedule = document.getElementById('scheduleContainer')?.contains(e.target);

            // ❗ 지도 밖이면서 일정도 아닌 경우에만 전체 경로로 복귀
            if (!clickedInsideMap && !clickedInsideSchedule) {
                setFocusDay(null);
            }
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [setFocusDay]);

    // ✅ focusDay가 있을 경우 해당 첫 장소로 지도 중심 이동
    useEffect(() => {
        if (!mapObj.current || !focusDay) return;

        console.log('✅ 중심 이동 트리거됨'); // 🔍 이거 찍히는지 확인
        const dayPlan = routeData.find((r) => Number(r.day) === Number(focusDay));
        const firstPlace = dayPlan?.places?.[0];
        if (!firstPlace) return;

        console.log('📍 중심 이동 위치:', firstPlace.latitude, firstPlace.longitude); // 🔍 좌표 찍히는지 확인

        const latlng = new kakao.maps.LatLng(firstPlace.latitude, firstPlace.longitude);
        mapObj.current.panTo(latlng);
    }, [focusDay]);

    return (
        <div
            ref={mapRef}
            id="map-capture-target" // 캡처 대상 ID
            style={style || { width: '100%', height: '100%' }}
        />
    );
};

export default RouteMap_my;
