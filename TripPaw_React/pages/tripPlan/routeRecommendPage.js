import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import DayScheduleList from '../../components/tripPlan/DayScheduleList';
import AppLayout from '../../components/AppLayout';
import ActionButtons from '../../components/tripPlan/ActionButtons';

// ✅ SSR 비활성화된 카카오맵 컴포넌트 미리 선언
const RouteMapNoSSR = dynamic(() => import('../../components/tripPlan/RouteMap'), {
    ssr: false,
});


const header = {
    width: '100%',
    height: '80px'
}

const dividerStyle = {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginBottom: '20px',
};

const dividerLine = {
    width: '100%',
    border: '1px solid rgba(170, 169, 169, 0.9)',
};

const contentWrapper = {
    //border: '3px solid black',
    width: '70%',
    height: '80%',
    justifyContent: 'center',
    margin: 'auto',
    //marginTop: '10px',
}

const contentBox = {
    //border: '2px solid red',
    display: 'flex',
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    margin: 'auto',
}

const mapContainer = {
    flex: 5,
    width: '100%',
    height: '100%',
    //border: '2px solid blue'
};

const scheduleContainer = {
    flex: 3,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    overflowY: 'auto',            // 👈 스크롤 추가
    maxHeight: '600px',           // 👈 높이 제한 추가 (혹은 필요에 따라 height 설정)
    paddingRight: '8px',          // 👈 스크롤이 내용 가리지 않게 여유 공간
    /* 👇 스크롤 숨기기 */
    scrollbarWidth: 'none',       // Firefox
    msOverflowStyle: 'none',      // IE, Edge
    overscrollBehavior: 'contain', // 스크롤 바운스 방지
};




const RouteRecommendPage = () => {
    const router = useRouter();
    const [routeData, setRouteData] = useState(null);
    const [currentDay, setCurrentDay] = useState(1);
    const [kakaoReady, setKakaoReady] = useState(false);

    // ✅ 쿼리 데이터 파싱
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

    // ✅ Kakao API 로딩 여부 체크
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

    return (
        <AppLayout headerTheme="dark" >
            <div style={header} />
            <div style={contentWrapper}>
                {/* 카테고리 */}
                <div>

                </div>
                <h1>강아지와 함께! 에너지 넘치는 파워 여행 루틴</h1>

                <div style={dividerStyle}>
                    <div style={dividerLine} />
                </div>

                <div style={contentBox}>
                    <div style={mapContainer}>
                        {/* 지도*/}
                        <RouteMapNoSSR places={currentPlan.places} style={{ width: '100%', height: '100%' }} />
                    </div>
                    <div style={scheduleContainer}>
                        {/* 일정 */}
                        <div>
                            <DayScheduleList
                                routeData={routeData}
                                currentDay={currentDay}
                                onSelectDay={setCurrentDay}
                            />
                        </div>
                        <div>
                            <ActionButtons />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default RouteRecommendPage;
