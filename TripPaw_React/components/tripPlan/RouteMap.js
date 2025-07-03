import React, {
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle
} from 'react';
import html2canvas from 'html2canvas';

const RouteMap = forwardRef(
    ({ routeData, style, setMapInstance, focusDay, setFocusDay }, ref) => {
        const mapRef = useRef(null);
        const mapObj = useRef(null);
        const polylineRefs = useRef([]);
        const markerRefs = useRef([]);
        const COLORS = ['#0077ff', '#FF6347', '#32CD32', '#FF8C00', '#8A2BE2', '#00CED1'];

        // 🗺️ 지도 초기화
        useEffect(() => {
            if (!window.kakao || !window.kakao.maps || !routeData?.length) return;
            const firstPlace = routeData[0]?.places?.[0];
            if (!firstPlace) return;

            const center = new kakao.maps.LatLng(firstPlace.latitude, firstPlace.longitude);
            mapObj.current = new kakao.maps.Map(mapRef.current, {
                center,
                level: 6
            });

            setMapInstance?.(mapObj.current);
        }, []);

        // 📍 마커 및 경로 그리기
        useEffect(() => {
            if (!mapObj.current || !routeData?.length) return;

            // 기존 마커 및 선 제거
            polylineRefs.current.forEach(line => line.setMap(null));
            markerRefs.current.forEach(marker => marker.setMap(null));
            polylineRefs.current = [];
            markerRefs.current = [];

            const bounds = new kakao.maps.LatLngBounds();
            const visibleData = focusDay
                ? routeData.filter(r => Number(r.day) === Number(focusDay))
                : routeData;

            visibleData.forEach(dayPlan => {
                const path = [];
                const color = COLORS[dayPlan.day % COLORS.length];

                dayPlan.places.forEach(place => {
                    const latlng = new kakao.maps.LatLng(place.latitude, place.longitude);
                    bounds.extend(latlng);
                    path.push(latlng);

                    const marker = new kakao.maps.Marker({
                        map: mapObj.current,
                        position: latlng,
                        title: `${dayPlan.day}일차 - ${place.name}`
                    });
                    markerRefs.current.push(marker);
                });

                const polyline = new kakao.maps.Polyline({
                    map: mapObj.current,
                    path,
                    strokeWeight: 4,
                    strokeColor: color,
                    strokeOpacity: 0.8,
                    strokeStyle: 'solid'
                });
                polylineRefs.current.push(polyline);
            });

            if (!focusDay) {
                mapObj.current.setBounds(bounds);
            }
        }, [routeData, focusDay]);

        // 클릭 시 focusDay 해제
        useEffect(() => {
            const handleClickOutside = e => {
                const clickedMap = mapRef.current?.contains(e.target);
                const clickedSchedule = document
                    .getElementById('scheduleContainer')
                    ?.contains(e.target);

                if (!clickedMap && !clickedSchedule) {
                    setFocusDay(null);
                }
            };

            window.addEventListener('click', handleClickOutside);
            return () => window.removeEventListener('click', handleClickOutside);
        }, [setFocusDay]);

        // focusDay 변경 시 중심 이동
        useEffect(() => {
            if (!mapObj.current || !focusDay) return;
            const dayPlan = routeData.find(r => Number(r.day) === Number(focusDay));
            const firstPlace = dayPlan?.places?.[0];
            if (!firstPlace) return;

            const latlng = new kakao.maps.LatLng(firstPlace.latitude, firstPlace.longitude);
            mapObj.current.panTo(latlng);
        }, [focusDay]);

        // 📸 외부에서 호출 가능한 캡처 메서드 등록
        useImperativeHandle(ref, () => ({
            captureMap: async () => {
                const mapDiv = document.getElementById('map-capture-target');
                if (!mapDiv) {
                    throw new Error('지도 요소를 찾을 수 없습니다.');
                }
                const canvas = await html2canvas(mapDiv);
                return canvas.toDataURL('image/png');
            }
        }));

        return (
            <div
                ref={mapRef}
                id="map-capture-target"
                style={style || { width: '100%', height: '100%' }}
            />
        );
    }
);

export default RouteMap;
