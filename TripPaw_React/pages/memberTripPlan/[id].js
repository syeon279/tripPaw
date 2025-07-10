import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import DayScheduleList from '../../components/tripPlan/DayScheduleList';
import AppLayout from '../../components/AppLayout';
import MypageActionButton from '../../components/tripPlan/MypageAcionButton';
import TitleModal from '../../components/tripPlan/TitleModal';
import axios from 'axios';
import { format } from 'date-fns';

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

const TripPlanDetail = () => {
    const router = useRouter();
    const mapRef = useRef(null);

    const [routeData, setRouteData] = useState(null);
    const [currentDay, setCurrentDay] = useState(1);
    const [kakaoReady, setKakaoReady] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);
    const [focusDay, setFocusDay] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [countPeople, setCountPeople] = useState(null);
    const [countPet, setCountPet] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [title, setTitle] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 위한 state
    const [userId, setUserId] = useState(1);
    const { id } = router.query;

    useEffect(() => {
        const fetchTripDetail = async () => {
            if (!router.isReady || !id) return;

            try {
                const res = await axios.get(`http://localhost:8080/memberTripPlan/${id}`);
                const data = res.data;
                setRouteData(data.routeData || []);
                setCountPeople(data.countPeople);
                setCountPet(data.countPet);
                setStartDate(data.startDate);
                setEndDate(data.endDate);
                setTitle(data.title);
                console.log('data:', res.data);
            } catch (err) {
                console.error("여행 경로 불러오기 실패", err);
            }

        };

        fetchTripDetail();

        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/auth/check', {
                    withCredentials: true,
                });

                console.log('user : ', response.data);

                if (response.status === 200) {
                    setIsLoggedIn(true);
                    // 백엔드에서 받은 username으로 상태 업데이트
                    setUserId(response.data.id);
                    return true; // 성공 시 true 반환
                }
            } catch (error) {
                console.error("로그인 상태 확인 실패:", error);
                alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
                router.push('/member/login');
                return false; // 실패 시 false 반환
            }
        };

        // ✅ 함수 호출
        fetchTripDetail();
        checkLoginStatus();

    }, [router.isReady, router.query]);

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

    const handleEdit = async () => {

        try {
            router.push({
                pathname: `/memberTripPlan/memberTripPlanEdit/${id}`,
                query: {
                    id: id,
                    startDate,
                    endDate,
                    countPeople,
                    countPet,
                },
            });
        } catch (err) {
            console.error('MemberTripPlan 수정용 저장 실패:', err);
            alert('수정 실패');
        }
    };

    //이대로 예약하기 : 추가

    return (
        <AppLayout>
            <div style={layoutStyle.header} />
            <div style={layoutStyle.contentWrapper}>
                <h1>{title || '여행 상세 보기'}</h1>

                {startDate && endDate && (
                    <p style={{ fontSize: '16px', color: '#555', marginTop: '4px' }}>
                        {format(new Date(startDate), 'yyyy.MM.dd')} ~ {format(new Date(endDate), 'yyyy.MM.dd')}
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
                            setFocusDay={setFocusDay}
                        />
                        <MypageActionButton
                            // 예약하기 추가
                            //onReserv={() => }
                            onEdit={() => handleEdit()}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default TripPlanDetail;
