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

const MyPlaces = () => {
    const router = useRouter();
    const [memberId] = useState(1); // FIXME: 로그인 사용자 ID로 교체 필요
    const [places, setPlaces] = useState([]);
    const [fallbackImages, setFallbackImages] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:8080/favorite/member/place/${memberId}`)
            .then(res => {
                const favoritePlaces = Object.values(res.data); // 객체를 배열로 변환
                setPlaces(favoritePlaces);
                console.log('넘어온 favoritePlace : ', favoritePlaces);

                const fallbackMap = {};
                favoritePlaces.forEach(place => {
                    const randomNum = Math.floor(Math.random() * 10) + 1;
                    if (place?.placeId) {
                        fallbackMap[place.placeId] = `/image/other/randomImage/${randomNum}.jpg`;
                    }
                });
                setFallbackImages(fallbackMap);
            })
            .catch(err => {
                console.error('즐겨찾기 장소 목록 불러오기 실패', err);
                setPlaces([]);
            });
    }, [memberId]);

    return (
        <MypageLayout>
            <div>
                <div>마이페이지 &gt; 내 장소</div>
                <div>내 장소</div>
                <div style={layoutStyle.divider}>
                    <div style={layoutStyle.dividerLine} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {places.length === 0 ? (
                        <p>일치하는 장소가 없습니다.</p>
                    ) : (
                        places.map((place) => (
                            place?.placeId && (
                                <div
                                    key={place.favoriteId}
                                    onClick={() => router.push(`/place/${place.placeId}`)}
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
                                            alt="장소 이미지"
                                            src={
                                                place.imageUrl && place.imageUrl.length > 0
                                                    ? place.imageUrl
                                                    : fallbackImages[place.placeId] || "/image/other/tempImage.jpg"
                                            }
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/image/other/tempImage.jpg";
                                            }}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                            <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{place.placeName}</p>
                                            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>{place.placeTypeName || ''}</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px', gap: '6px' }}>
                                            <p style={{ fontSize: '14px', color: '#f44336', margin: 0 }}>
                                                {place.rating?.toFixed(1) || '0.0'}
                                            </p>
                                            <p style={{ fontSize: '14px', color: '#f44336', margin: 0 }}>
                                                {'★'.repeat(Math.floor(place.rating || 0)) + '☆'.repeat(5 - Math.floor(place.rating || 0))}
                                            </p>
                                            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                                                | 리뷰 {place.reviewCount || 0}
                                            </p>
                                        </div>
                                        <p style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>{place.region}</p>
                                    </div>
                                </div>
                            )
                        ))
                    )}
                </div>
            </div>
        </MypageLayout>
    );
};

export default MyPlaces;
