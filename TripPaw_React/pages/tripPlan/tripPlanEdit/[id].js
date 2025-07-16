import React, { useState, useEffect, useRef } from 'react';
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
    const TripPlanId = router.query.id;

    const [routeData, setRouteData] = useState([]);
    const [currentDay, setCurrentDay] = useState(1);
    const [kakaoReady, setKakaoReady] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);
    const [focusDay, setFocusDay] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [countPeople, setCountPeople] = useState(null);
    const [countPet, setCountPet] = useState(null);
    const [isPlaceSearchOpen, setIsPlaceSearchOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 위한 state
    const [memberId, setMemberId] = useState(1);

    // 로그인 한 유저 id가져오기
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/auth/check', {
                    withCredentials: true,
                });

                //console.log('user : ', response.data);

                if (response.status === 200) {
                    setIsLoggedIn(true);
                    // 백엔드에서 받은 username으로 상태 업데이트
                    setMemberId(response.data.id);
                    return true; // 성공 시 true 반환
                }
            } catch (error) {
                console.error("로그인 상태 확인 실패:", error);
                return false; // 실패 시 false 반환
            }
        };
        checkLoginStatus();
    }, [router.isReady, router.query]);


    useEffect(() => {
        const fetchTripById = async (TripPlanId) => {
            try {
                const response = await axios.get(`http://localhost:8080/tripPlan/${TripPlanId}`);
                const trip = response.data;

                if (!trip.tripPlanCourses || !Array.isArray(trip.tripPlanCourses)) {
                    throw new Error('잘못된 여행 데이터 형식입니다.');
                }

                const convertedRouteData = trip.tripPlanCourses.map((course, idx) => ({
                    day: idx + 1,
                    places: course.route.routePlaces
                        .map((rp) => {
                            const place = rp.place;
                            if (!place || !place.id || !place.latitude || !place.longitude) return null;

                            return {
                                placeId: place.id,
                                draggableId: `day-${idx + 1}-place-${place.id}`,
                                name: place.name,
                                description: place.description,
                                latitude: parseFloat(place.latitude),
                                longitude: parseFloat(place.longitude),
                                imageUrl: place.imageUrl,
                            };
                        })
                        .filter(Boolean),
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

        if (TripPlanId) {
            fetchTripById(TripPlanId);
        } else if (router.query.data) {
            try {
                const parsed = JSON.parse(decodeURIComponent(router.query.data));
                const parsedRouteData = parsed.map((day) => ({
                    ...day,
                    places: day.places.map((p) => ({
                        ...p,
                        draggableId: `day-${day.day}-place-${p.placeId}`,
                    })),
                }));
                setRouteData(parsedRouteData);
                setStartDate(router.query.startDate);
                setEndDate(router.query.endDate);
                setCountPeople(router.query.countPeople);
                setCountPet(router.query.countPet);
            } catch (e) {
                console.error('데이터 파싱 오류', e);
            }
        }
    }, [TripPlanId]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (window.kakao && window.kakao.maps) {
                setKakaoReady(true);
                clearInterval(interval);
            }
        }, 200);
        return () => clearInterval(interval);
    }, []);

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
                memberId
            };

            const hasAtLeastOnePlace = routeData.some(day => day.places && day.places.length > 0);
            if (!hasAtLeastOnePlace) {
                alert('여행 일정에 최소 1개 이상의 장소가 필요합니다.');
                return;
            }

            await axios.post('http://localhost:8080/memberTripPlan/recommend/save', tripData);
            alert('여행 저장 완료!');
        } catch (error) {
            console.error('저장 실패:', error);
            alert('저장 중 오류 발생');
        }
    };

    const handleDeletePlace = (day, placeId) => {
        setRouteData((prev) =>
            prev.map((route) => {
                if (route.day === day) {
                    if (route.places.length <= 1) {
                        alert('일정에는 최소 1개의 장소가 필요합니다.');
                        return route; // 삭제하지 않고 기존 유지
                    }

                    return {
                        ...route,
                        places: route.places.filter((p) => p.placeId !== placeId),
                    };
                }
                return route;
            })
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
                                draggableId: `day-${dayPlan.day}-place-${place.id}`,
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

    if (!routeData.length || !kakaoReady) {
        return <div>지도를 불러오는 중입니다...</div>;
    }

    return (
        <AppLayout>
            <div style={layoutStyle.header} />
            <div style={layoutStyle.contentWrapper}>
                <div style={{ display: 'flex', alignItems: 'end' }}>
                    <h1>TripPaw가 추천하는 맞춤 여행</h1>
                    {startDate && endDate && (
                        <p style={{ fontSize: '16px', color: '#555', marginTop: '0px', marginLeft: '10px' }}>
                            {format(new Date(startDate), 'yyyy.MM.dd')} ~{' '}
                            {format(new Date(endDate), 'yyyy.MM.dd')}
                        </p>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between' }} >
                    <div>{countPeople}명 {countPet}견</div>
                    <div style={{ marginRight: '20px', fontSize: '20px', marginBottom: '10px' }}>장소 카드를 움직여 일정을 수정해 보세요!</div>
                </div>

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
                            onSelectDay={(day) => {
                                setCurrentDay(day);
                                setFocusDay(day);
                            }}
                            onPlaceClick={handlePlaceClick}
                            onDeletePlace={handleDeletePlace}
                            setFocusDay={setFocusDay}
                            setRouteData={setRouteData}
                        />
                        {TripPlanId && (
                            <EditActionButtons
                                onSave={() => setShowModal(true)}
                                onEditPlace={() => setIsPlaceSearchOpen(true)}
                            />
                        )}
                    </div>

                    {isPlaceSearchOpen && (
                        <PlaceSearchModal
                            onClose={() => setIsPlaceSearchOpen(false)}
                            onSelectPlace={handleAddPlace}
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