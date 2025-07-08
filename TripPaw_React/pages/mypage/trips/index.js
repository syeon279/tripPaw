import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import MypageLayout from "@/components/layout/MypageLayout";

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
    const [memberId] = useState(1); // FIXME: 로그인 사용자 ID로 교체 필요
    const [trips, setTrips] = useState([]);
    const [fallbackImages, setFallbackImages] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:8080/favorite/member/trips/${memberId}`)
            .then(res => {
                const favoriteTrips = res.data;
                setTrips(favoriteTrips);
                console.log('넘어온 favoriteTrips : ', favoriteTrips);

                const fallbackMap = {};
                favoriteTrips.forEach(trip => {
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
                                onClick={() => router.push(`/tripPlan/${trip.favoriteId}`)}
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
                                        총 {trip.days}일 여행
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontSize: '14px', color: '#f44336' }}>
                                            {trip.avgRating?.toFixed(1) || '0.0'}
                                        </span>
                                        <span style={{ fontSize: '14px', color: '#f44336' }}>
                                            {'★'.repeat(Math.floor(trip.avgRating || 0)) + '☆'.repeat(5 - Math.floor(trip.avgRating || 0))}
                                        </span>
                                        <span style={{ fontSize: '12px', color: '#666' }}>
                                            | 리뷰 {trip.reviewCount || 0}
                                        </span>
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
