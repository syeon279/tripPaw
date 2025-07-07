import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import DayScheduleList from '../../../components/tripPlanEdit/DayScheduleList';
import AppLayout from '../../../components/AppLayout';
import EditActionButtons from '../../../components/tripPlanEdit/EditActionButtons';
import TitleModal from '@/components/tripPlan/TitleModal';
import PlaceSearchModal from '@/components/tripPlanEdit/PlaceSearchModal';
import axios from 'axios';
import { format } from 'date-fns';

const RouteMapNoSSR = dynamic(() => import('../../../components/tripPlan/RouteMap'), {
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

const tripEdit = () => {
    const router = useRouter();
    const mapRef = useRef(null);

    const [routeData, setRouteData] = useState(null);
    const [currentDay, setCurrentDay] = useState(1);
    const [kakaoReady, setKakaoReady] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);
    const [focusDay, setFocusDay] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [countPeople, setCountPeople] = useState(null);
    const [countPet, setCountPet] = useState(null);

    const [isPlaceSearchOpen, setIsPlaceSearchOpen] = useState(false); // ✅ 추가

    useEffect(() => {
        const fetchTripById = async (id) => {
            try {
                const response = await axios.get(`http://localhost:8080/tripPlan/${id}`);
                const trip = response.data;
                console.log('🚀 받은 trip 데이터:', trip);

                if (!trip.tripPlanCourses || !Array.isArray(trip.tripPlanCourses)) {
                    throw new Error('잘못된 여행 데이터 형식입니다.');
                }

                const convertedRouteData = trip.tripPlanCourses.map((course, idx) => ({
                    day: idx + 1,
                    places: course.route.routePlaces
                        .filter((rp) => rp.place && rp.place.latitude && rp.place.longitude)
                        .map((rp) => ({
                            placeId: rp.place.id,
                            name: rp.place.name,
                            description: rp.place.description,
                            latitude: parseFloat(rp.place.latitude),
                            longitude: parseFloat(rp.place.longitude),
                            imageUrl: rp.place.imageUrl,
                        })),
                }));

                setRouteData(convertedRouteData);
                setStartDate(trip.startDate || router.query.startDate);
                setEndDate(trip.endDate || router.query.endDate);
                setCountPeople(trip.countPeople || router.query.countPeople);
                setCountPet(trip.countPet || router.query.countPet);
            } catch (err) {
                console.error('🚨 여행 경로 불러오기 실패:', err);
            }
        };

        if (router.query.id) {
            fetchTripById(router.query.id);
        } else if (router.query.data) {
            try {
                const parsed = JSON.parse(decodeURIComponent(router.query.data));
                setRouteData(parsed);
                setStartDate(router.query.startDate);
                setEndDate(router.query.endDate);
                setCountPeople(router.query.countPeople);
                setCountPet(router.query.countPet);
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

    const handleCaptureMap = async () => {
        try {
            return await mapRef.current?.captureMap();
        } catch (err) {
            console.warn('지도 캡처 오류:', err);
            return null;
        }
    };

    const handleTripSave = async ({ title, mapImage }) => {
        try {
            const tripData = {
                title,
                startDate,
                endDate,
                countPeople,
                countPet,
                routeData,
                mapImage,
            };

            await axios.post('http://localhost:8080/tripPlan/save', tripData);
            alert('여행 저장 완료!');
        } catch (error) {
            console.error('저장 실패:', error);
            alert('저장 중 오류 발생');
        }
    };

    const handleDeletePlace = (day, placeId) => {
        setRouteData((prev) =>
            prev.map((route) =>
                route.day === day
                    ? { ...route, places: route.places.filter((p) => p.placeId !== placeId) }
                    : route
            )
        );
    };

    const handleAddPlace = (place) => {
        setRouteData((prev) =>
            prev.map((dayPlan) =>
                dayPlan.day === currentDay
                    ? {
                        ...dayPlan,
                        places: [
                            ...dayPlan.places,
                            {
                                placeId: place.id,
                                name: place.name,
                                latitude: parseFloat(place.latitude),
                                longitude: parseFloat(place.longitude),
                                description: place.description,
                                imageUrl: place.imageUrl,
                            },
                        ],
                    }
                    : dayPlan
            )
        );
        setIsPlaceSearchOpen(false);
    };

    return (
        <AppLayout>
            <div style={layoutStyle.header} />
            <div style={layoutStyle.contentWrapper}>
                <h1>강아지와 함께! 에너지 넘치는 파워 여행 루틴</h1>
                {startDate && endDate && (
                    <p style={{ fontSize: '16px', color: '#555', marginTop: '4px' }}>
                        {format(new Date(startDate), 'yyyy.MM.dd')} ~{' '}
                        {format(new Date(endDate), 'yyyy.MM.dd')}
                    </p>
                )}
                <div>{countPeople}명 {countPet}견</div>

                <div style={layoutStyle.divider}>
                    <div style={layoutStyle.dividerLine} />
                </div>

                <div style={layoutStyle.contentBox}>
                    <div id="map-capture-target" style={layoutStyle.mapContainer}>
                        <RouteMapNoSSR
                            ref={mapRef}
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
                            onDeletePlace={handleDeletePlace}
                            setFocusDay={setFocusDay}
                            setRouteData={setRouteData}
                        />
                        {router.query.id && (
                            <EditActionButtons
                                onSave={() => setShowModal(true)}
                                onEditPlace={() => setIsPlaceSearchOpen(true)} // ✅ 수정
                            />
                        )}
                    </div>

                    {isPlaceSearchOpen && (
                        <PlaceSearchModal
                            onClose={() => setIsPlaceSearchOpen(false)}
                            onSelectPlace={handleAddPlace} // ✅ 직접 연결
                        />
                    )}

                    {showModal && (
                        <TitleModal
                            onClose={() => setShowModal(false)}
                            onSave={handleTripSave}
                            defaultStartDate={startDate}
                            defaultEndDate={endDate}
                            defaultCountPeople={countPeople}
                            defaultCountPet={countPet}
                            onCaptureMap={handleCaptureMap}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default tripEdit;
