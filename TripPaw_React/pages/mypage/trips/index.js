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
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 위한 state
    const [memberId, setMemberId] = useState(1);
    const [trips, setTrips] = useState([]);
    const [fallbackImages, setFallbackImages] = useState({});

    // 로그인 한 유저 id가져오기
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/auth/check', {
                    withCredentials: true,
                });

                console.log('user : ', response.data);

                if (response.status === 200) {
                    setIsLoggedIn(true);
                    // 백엔드에서 받은 username으로 상태 업데이트
                    setMemberId(response.data.id);
                    return true; // 성공 시 true 반환
                }
            } catch (error) {
                console.error("로그인 상태 확인 실패:", error);
                alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
                router.push('/member/login');
                return false; // 실패 시 false 반환
            }
        };
        checkLoginStatus();
    }, [router.isReady, router.query]);

    useEffect(() => {
        axios.get(`http://localhost:8080/favorite/member/trips/${memberId}`)
            .then(res => {
                const myTrips = res.data;
                setTrips(myTrips);
                console.log('넘어온 myTrips : ', myTrips);

                const fallbackMap = {};
                myTrips.forEach(trip => {
                    const randomNum = Math.floor(Math.random() * 10) + 1;
                    fallbackMap[trip.tripPlanId] = `/image/other/randomImage/${randomNum}.jpg`;
                });
                setFallbackImages(fallbackMap);
            })
            .catch(err => {
                console.error('즐겨찾기 여행 목록 불러오기 실패', err);
                setTrips([]);
            });
    }, [memberId]);

    return (
        <MypageLayout>
            <div>
                <div>마이페이지 &gt; 내 여행 </div>
                <div>내 여행</div>
                <div style={layoutStyle.divider}>
                    <div style={layoutStyle.dividerLine} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {trips.length === 0 ? (
                        <p>여행이 없습니다.</p>
                    ) : (
                        trips.map((trip) => (
                            <div
                                key={trip.favoriteId}
                                onClick={() => router.push(`/memberTripPlan/${trip.myTripId}`)}
                                style={{
                                    borderRadius: '16px',
                                    backgroundColor: 'white',
                                    width: '400px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    border: '1px solid #e0e0e0',
                                    boxSizing: 'border-box',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                }}
                            >
                                <div style={{
                                    width: '100%',
                                    height: '180px',
                                    borderRadius: '16px 16px 0 0',
                                    overflow: 'hidden'
                                }}>
                                    <img
                                        alt="여행 이미지"
                                        src={
                                            trip.imageUrl && trip.imageUrl.length > 0
                                                ? trip.imageUrl
                                                : fallbackImages[trip.tripPlanId] || "/image/other/tempImage.jpg"
                                        }
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
                                    <div style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}>
                                        {trip.startDate} ~ {trip.endDate}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </MypageLayout>
    );
};

export default Trips;
