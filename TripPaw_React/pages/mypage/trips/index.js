import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import MypageLayout from "@/components/layout/MyPageLayout";

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
};

const Trips = () => {
    const router = useRouter();
    const [memberId, setMemberId] = useState(null);
    const [tab, setTab] = useState("mytrips"); // mytrips or created
    const [trips, setTrips] = useState([]);
    const [fallbackImages, setFallbackImages] = useState({});

    // 로그인 확인 및 memberId 세팅
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/auth/check', {
                    withCredentials: true,
                });
                if (response.status === 200) {
                    setMemberId(response.data.id);
                }
            } catch (error) {
                alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
                router.push('/member/login');
            }
        };
        checkLoginStatus();
    }, []);

    // 탭별 데이터 가져오기
    useEffect(() => {
        if (!memberId) return;

        const fetchTrips = async () => {
            try {
                const url =
                    tab === "mytrips"
                        ? `http://localhost:8080/memberTripPlan/${memberId}/mytrips`
                        : `http://localhost:8080/tripPlan/${memberId}/trips`;

                const response = await axios.get(url);
                const data = response.data;

                setTrips(data);

                const fallbackMap = {};
                data.forEach(trip => {
                    const tripId = trip.tripPlanId || trip.id;
                    const randomNum = Math.floor(Math.random() * 10) + 1;
                    fallbackMap[tripId] = `/image/other/randomImage/${randomNum}.jpg`;
                });
                setFallbackImages(fallbackMap);
            } catch (error) {
                console.error('여행 목록 불러오기 실패:', error);
                setTrips([]);
            }
        };

        fetchTrips();
    }, [memberId, tab]);

    const handleTabChange = (newTab) => setTab(newTab);

    const TripCard = ({ trip }) => {
        const tripId = trip.myTripId || trip.id;
        const imageUrl = trip.imageUrl && trip.imageUrl.length > 0
            ? trip.imageUrl
            : fallbackImages[trip.tripPlanId || trip.id] || "/image/other/tempImage.jpg";

        return (
            <div
                key={tripId}
                onClick={() =>
                    router.push(tab === "mytrips"
                        ? `/memberTripPlan/${tripId}`
                        : `/tripPlan/${tripId}`)
                }
                style={{
                    borderRadius: '16px',
                    backgroundColor: 'white',
                    width: '400px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    border: '1px solid #e0e0e0',
                    overflow: 'hidden',
                    cursor: 'pointer',
                }}
            >
                <div style={{ width: '100%', height: '180px', overflow: 'hidden' }}>
                    <img
                        alt="여행 이미지"
                        src={imageUrl}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/image/other/tempImage.jpg";
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
                <div style={{ padding: '16px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                        {trip.title}
                    </div>
                    {trip.startDate && trip.endDate && (
                        <div style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}>
                            {trip.startDate} ~ {trip.endDate}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <MypageLayout>
            <div>
                <div>마이페이지 &gt; 내 여행</div>
                <h2 style={{ margin: '20px 0' }}>내 여행</h2>

                {/* 탭 선택 */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                    <button
                        onClick={() => handleTabChange("mytrips")}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '10px',
                            border: '1px solid #ccc',
                            backgroundColor: tab === "mytrips" ? '#333' : '#fff',
                            color: tab === "mytrips" ? '#fff' : '#333',
                            cursor: 'pointer',
                        }}
                    >
                        내가 다녀온 여행
                    </button>
                    <button
                        onClick={() => handleTabChange("created")}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '10px',
                            border: '1px solid #ccc',
                            backgroundColor: tab === "created" ? '#333' : '#fff',
                            color: tab === "created" ? '#fff' : '#333',
                            cursor: 'pointer',
                        }}
                    >
                        내가 만든 여행
                    </button>
                </div>

                <div style={layoutStyle.divider}>
                    <div style={layoutStyle.dividerLine} />
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {trips.length === 0 ? (
                        <p>여행이 없습니다.</p>
                    ) : (
                        trips.map((trip) => <TripCard key={trip.id || trip.myTripId} trip={trip} />)
                    )}
                </div>
            </div>
        </MypageLayout>
    );
};

export default Trips;
