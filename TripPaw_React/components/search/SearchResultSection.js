import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';

const SearchResultSection = ({
    results,
    keyword,
    setKeyword,
    handleSearch,
    handleKeyPress,
    setSectionIndex
}) => {
    const [filteredResults, setFilteredResults] = useState(results);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        if (!keyword.trim()) {
            setFilteredResults(results);
            return;
        }

        const lowerKeyword = keyword.toLowerCase();
        const { places = [], tripPlans = [] } = results;

        const filteredPlaces = places.filter((place) =>
            place.name.toLowerCase().includes(lowerKeyword) ||
            place.placeType?.name?.toLowerCase().includes(lowerKeyword)
        );

        const filteredTripPlans = tripPlans.filter((plan) =>
            plan.title.toLowerCase().includes(lowerKeyword)
        );

        setFilteredResults({
            places: filteredPlaces,
            tripPlans: filteredTripPlans,
        });
    }, [keyword, results]);

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;

        const handleWheel = (e) => {
            if (e.deltaY === 0) return;
            e.preventDefault();
            e.stopPropagation();
            el.scrollLeft += e.deltaY;
        };

        el.addEventListener('wheel', handleWheel, { passive: false });
        return () => el.removeEventListener('wheel', handleWheel);
    }, []);

    if (!results) return <div>검색 결과가 없습니다.</div>;

    const { places = [], tripPlans = [] } = filteredResults;

    // 장소별로 고정 랜덤 이미지 매핑
    const getFallbackImages = (places) => {
        const map = {};
        places.forEach(place => {
            const randomNum = Math.floor(Math.random() * 10) + 1;
            map[place.id] = `/image/other/randomImage/${randomNum}.jpg`;
        });
        return map;
    };

    const fallbackImages = useMemo(() => getFallbackImages(places), [places]);

    return (
        <div style={{ width: '100%', maxWidth: '960px', display: 'flex', flexDirection: 'column' }}>
            {/* 검색창 */}
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '24px',
                borderRadius: '16px',
                width: '100%',
                color: 'black',
                marginTop: '50px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.52)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
            }}>
                <ArrowLeftOutlined onClick={() => setSectionIndex(0)} />
                <input
                    style={{
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'transparent',
                        width: '80%',
                        marginRight: '20px',
                        fontSize: '1.1rem',
                    }}
                    type="text"
                    placeholder="검색어로 결과를 다시 필터링해보세요"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
            </div>

            {/* 제목 */}
            <div style={{
                color: 'white',
                display: 'block',
                fontSize: '1.5em',
                marginTop: '20px',
            }}>
                <h3 style={{ color: 'white' }}> 이런 장소는 어떠세요? </h3>
                <div> 검색하신 키워드에 맞는 장소를 찾아왔어요! </div>
            </div>

            {/* 장소 결과 */}
            <div
                ref={scrollContainerRef}
                style={{
                    marginTop: '16px',
                    marginBottom: '16px',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    whiteSpace: 'nowrap',
                    scrollBehavior: 'smooth',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
                onMouseEnter={() => document.body.style.overflow = 'hidden'}
                onMouseLeave={() => document.body.style.overflow = 'auto'}
            >
                <div style={{ display: 'flex', minWidth: 'fit-content', gap: '12px' }}>
                    {places.length === 0 ? (
                        <p>일치하는 장소가 없습니다.</p>
                    ) : (
                        places.map((place) => (
                            <div
                                key={place.id}
                                style={{
                                    borderRadius: '16px',
                                    backgroundColor: 'white',
                                    width: '400px',
                                    display: 'inline-block',
                                    verticalAlign: 'top',
                                    marginRight: '12px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    border: '1px solid #e0e0e0',
                                    boxSizing: 'border-box',
                                    overflow: 'hidden',
                                }}
                            >
                                {/* 이미지 */}
                                <div style={{ width: '100%', height: '180px', borderRadius: '16px 16px 0 0', overflow: 'hidden' }}>
                                    <img
                                        alt="장소 이미지"
                                        src={place.imageUrl && place.imageUrl.length > 0 ? place.imageUrl : fallbackImages[place.id]}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/image/other/tempImage.jpg"; // 이건 무조건 존재해야 함
                                        }}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>

                                {/* 텍스트 정보 */}
                                <div style={{ padding: '16px' }}>
                                    {/* 이름 + 타입 */}
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                        <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                                            {place.name}
                                        </p>
                                        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                                            {place.placeType.name}
                                        </p>
                                    </div>

                                    {/* 별점 + 리뷰 수 */}
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

                                    {/* 상세 주소 */}
                                    <p style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>
                                        {place.region}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* 여행 코스 */}
            {/* 제목 */}
            <div style={{
                color: 'white',
                display: 'block',
                fontSize: '1.5em',
                marginTop: '20px',
            }}>
                <h3 style={{ color: 'white' }}> 내 취향에 맞는 특별한 여행을 떠나봐요! </h3>
                <div> 트립포우가 당신에게 딱 맞는 여행경로를 추천해 줄게요 </div>
            </div>
            <div style={{ marginTop: '16px' }}>
                <div>
                    {tripPlans.length === 0 ? (
                        <p>일치하는 여행 코스가 없습니다.</p>
                    ) : (
                        tripPlans.map((plan) => (
                            <div
                                key={plan.id}
                                style={{
                                    border: '1px solid #aaa',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    marginBottom: '16px',
                                    backgroundColor: '#f9f9f9',
                                }}
                            >
                                <h3>{plan.title}</h3>
                                <p>기간: {plan.days}일</p>
                                {plan.imageUrl && (
                                    <img
                                        src={plan.imageUrl}
                                        alt={plan.title}
                                        style={{
                                            width: '100%',
                                            maxHeight: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                        }}
                                    />
                                )}
                                <p>작성일: {new Date(plan.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchResultSection;
