import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import DayScheduleList from '../../components/tripPlan/DayScheduleList';
import AppLayout from '../../components/AppLayout';
import ActionButtons from '../../components/tripPlan/ActionButtons';
import TitleModal from '../../components/tripPlan/TitleModal';
import axios from 'axios';

// SSR 비활성화된 카카오맵 컴포넌트
const RouteMapNoSSR = dynamic(() => import('../../components/tripPlan/RouteMap'), {
    ssr: false,
});

const layoutStyle = {
    header: { width: '100%', height: '80px' },
    divider: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        marginBottom: '20px',
    },
    dividerLine: {
        width: '100%',
        border: '1px solid rgba(170, 169, 169, 0.9)',
    },
    contentWrapper: {
        width: '70%',
        height: '80%',
        justifyContent: 'center',
        margin: 'auto',
    },
    contentBox: {
        display: 'flex',
        width: '100%',
        height: '80%',
        justifyContent: 'center',
        margin: 'auto',
    },
    mapContainer: {
        flex: 5,
        width: '100%',
        height: '100%',
    },
    scheduleContainer: {
        flex: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        overflowY: 'auto',
        maxHeight: '600px',
        paddingRight: '8px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        overscrollBehavior: 'contain',
    },
};

const RouteRecommendPage = () => {
    const router = useRouter();
    const mapRef = useRef(null); // 🌟 지도 캡처용 ref

    const [routeData, setRouteData] = useState(null);
    const [currentDay, setCurrentDay] = useState(1);
    const [kakaoReady, setKakaoReady] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);
    const [focusDay, setFocusDay] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const requestData = useMemo(() => {
        if (!router.query.req) return null;
        try {
            return JSON.parse(decodeURIComponent(router.query.req));
        } catch (e) {
            return null;
        }
    }, [router.query.req]);

    useEffect(() => {
        if (router.query.data) {
            try {
                const parsed = JSON.parse(decodeURIComponent(router.query.data));
                setRouteData(parsed);
            } catch (e) {
                console.error('데이터 파싱 오류', e);
            }
        }
    }, [router.query]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (window.kakao && window.kakao.maps) {
                setKakaoReady(true);
                clearInterval(interval);
            }
        }, 200);
        return () => clearInterval(interval);
    }, []);

    if (!routeData || !Array.isArray(routeData)) {
        return <div>경로 데이터를 불러오는 중입니다...</div>;
    }

    const currentPlan = routeData.find((r) => r.day === currentDay);
    if (!currentPlan || !kakaoReady) {
        return <div>지도를 불러오는 중입니다...</div>;
    }

    const handlePlaceClick = (place, day) => {
        setFocusDay(day);
        if (mapInstance && window.kakao) {
            const latlng = new window.kakao.maps.LatLng(
                parseFloat(place.latitude),
                parseFloat(place.longitude)
            );
            mapInstance.panTo(latlng);
        }
    };

    // 🌟 지도 캡처 함수 전달
    const handleCaptureMap = async () => {
        try {
            return await mapRef.current?.captureMap();
        } catch (err) {
            console.warn('지도 캡처 오류:', err);
            return null;
        }
    };

    // 🌟 여행 저장 핸들러
    const handleTripSave = async ({ title, startDate, endDate, countPeople, countPet, mapImage }) => {
        try {
            const tripData = {
                title,
                startDate,
                endDate,
                countPeople,
                countPet,
                routeData,
                mapImage, // 🖼️ 캡처된 이미지 포함
            };

            await axios.post('http://localhost:8080/tripPlan/save', tripData);
            alert('여행 저장 완료!');
        } catch (error) {
            console.error('저장 실패:', error);
            alert('저장 중 오류 발생');
        }
    };

    // 수정을 위한 임시 저장
    const handleSave = async () => {
        let mapImageBase64 = null;

        try {
            mapImageBase64 = await handleCaptureMap();
        } catch (err) {
            console.warn('지도 캡처 실패:', err);
        }

        const title = '추천된 여행 경로';

        const travelData = {
            title,
            startDate: requestData?.startDate,
            endDate: requestData?.endDate,
            countPeople: requestData?.countPeople,
            countPet: requestData?.countPet,
            mapImage: mapImageBase64,
            routeData,
        };

        try {
            const res = await axios.post('http://localhost:8080/tripPlan/save', travelData);
            const tripId = res.data?.tripId;
            if (tripId) {
                router.push(`http://localhost:3000/tripPlan/tripPlanEdit/${tripId}`); // 🧭 수정 페이지로 이동
            } else {
                alert('여행 저장 후 이동 실패');
            }
        } catch (err) {
            console.error('수정용 저장 실패:', err);
            alert('저장 실패');
        }
    };


    return (
        <AppLayout>
            <div style={layoutStyle.header} />
            <div style={layoutStyle.contentWrapper}>
                <h1>강아지와 함께! 에너지 넘치는 파워 여행 루틴</h1>

                <div style={layoutStyle.divider}>
                    <div style={layoutStyle.dividerLine} />
                </div>

                <div style={layoutStyle.contentBox}>
                    <div id="map-capture-target" style={layoutStyle.mapContainer}>
                        <RouteMapNoSSR
                            ref={mapRef} // 📌 ref 연결
                            routeData={routeData}
                            focusDay={focusDay}
                            setFocusDay={setFocusDay}
                            setMapInstance={setMapInstance}
                        />
                    </div>

                    <div style={layoutStyle.scheduleContainer}>
                        <DayScheduleList
                            id="scheduleContainer"
                            routeData={routeData}
                            currentDay={currentDay}
                            onSelectDay={setCurrentDay}
                            onPlaceClick={handlePlaceClick}
                            setFocusDay={setFocusDay}
                        />
                        <ActionButtons onSave={() => setShowModal(true)} onEdit={() => handleSave} />
                    </div>

                    {showModal && (
                        <TitleModal
                            onClose={() => setShowModal(false)}
                            onSave={handleTripSave}
                            defaultStartDate={requestData?.startDate}
                            defaultEndDate={requestData?.endDate}
                            defaultCountPeople={requestData?.countPeople}
                            defaultCountPet={requestData?.countPet}
                            onCaptureMap={handleCaptureMap} // 📸 전달
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default RouteRecommendPage;
