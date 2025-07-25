import React, { useRef, useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import TripPlanMain from '../components/tripPlan/TripPlanMain';
import TripPlanSearch from '../components/search/TripPlanSearch';
import SearchResultSection from '../components/search/SearchResultSection';
import axios from 'axios';
import PetassistantLoading from '@/components/pet/PetassistantLoading';

const sectionStyle = (isActive) => ({
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: isActive ? 1 : 0.2,
    transform: isActive ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(60px)',
    transition: 'all 1s ease',
    zIndex: isActive ? 2 : 1,
    filter: isActive ? 'brightness(1)' : 'brightness(0.7)',
    position: 'relative',
});

const Home = () => {
    const containerRef = useRef(null);
    const [sectionIndex, setSectionIndex] = useState(0);
    const isScrollingRef = useRef(false);

    const [hasSearched, setHasSearched] = useState(false);
    const [searchResult, setSearchResult] = useState(null);
    const [keyword, setKeyword] = useState('');

    const sectionCount = hasSearched ? 3 : 2;

    // 로딩 및 페이징
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const [tripPlanOffset, setTripPlanOffset] = useState(0);

    // 🔍 검색 요청
    const handleSearch = async () => {
        if (!keyword.trim()) return;
        try {
            setIsLoading(true);

            const response = await axios.get('/search', {
                params: {
                    keyword,
                    offset,
                    tripPlanOffset
                }
            });
            //console.log('[검색 요청]', { keyword, offset });
            //console.log('[검색 데이터]]', response);

            const { places = [], tripPlans = [] } = response.data || {};
            const newResult = { places, tripPlans };

            if (offset === 0) {
                setSearchResult(newResult);
            } else {
                setSearchResult((prev) => ({
                    ...prev,
                    places: [...(prev?.places || []), ...places],
                    tripPlans: [...(prev?.tripPlans || []), ...tripPlans],
                }));
            }

            setHasSearched(true);
            setSectionIndex(2);

            if (places.length < 10 && tripPlans.length < 10) {
                setHasMore(false);
            }

        } catch (err) {
            console.log('❌ 검색 실패:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!hasSearched || !hasMore) return;
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const isBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 100;
            if (isBottom && !isLoading) {
                console.log('📦 스크롤 맨 아래 도달!');
                setOffset((prev) => prev + 10);
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [hasSearched, hasMore, isLoading]);

    useEffect(() => {
        if (hasMore && !isLoading) {
            handleSearch();
        }
    }, [offset, tripPlanOffset]);

    const handleSearchClick = () => {
        setSearchResult(null);
        setOffset(0);
        setTripPlanOffset(0);
        setHasMore(true);
        handleSearch();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            setSearchResult(null);
            setOffset(0);
            setTripPlanOffset(0);
            setHasMore(true);
            handleSearch();
        }
    };

    useEffect(() => {
        const handleWheel = (e) => {
            if (isScrollingRef.current) return;

            if (e.deltaY > 0 && sectionIndex < sectionCount - 1) {
                setSectionIndex((prev) => prev + 1);
                isScrollingRef.current = true;
            } else if (e.deltaY < 0 && sectionIndex > 0) {
                setSectionIndex((prev) => prev - 1);
                isScrollingRef.current = true;
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, [sectionIndex, sectionCount]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.scrollTo({
                top: window.innerHeight * sectionIndex,
                behavior: 'smooth',
            });
            setTimeout(() => {
                isScrollingRef.current = false;
            }, 1000);
        }
    }, [sectionIndex]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
        };
    }, []);

    return (
        <AppLayout headerTheme="white">
            {isLoading && <PetassistantLoading reservState="DEFAULT" />}
            <div
                ref={containerRef}
                style={{
                    height: '100vh',
                    overflow: 'hidden',
                    width: '100%',
                    scrollBehavior: 'smooth',
                }}
            >
                {/* ✅ 공통 배경: 1~3 세션 */}
                <div
                    style={{
                        height: '300vh',
                        position: 'relative',
                        backgroundImage: 'url("/image/background/index.png")',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'top center',
                    }}
                >
                    {/* ✅ 전체 오버레이 */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.4)',
                            zIndex: 0,
                        }}
                    />

                    {/* ✅ 섹션 1 */}
                    <section style={sectionStyle(sectionIndex === 0)}>
                        <TripPlanMain />
                    </section>

                    {/* ✅ 섹션 2 - 검색 */}
                    <section style={sectionStyle(sectionIndex === 1)}>
                        <TripPlanSearch
                            keyword={keyword}
                            setKeyword={setKeyword}
                            handleSearch={handleSearchClick}
                            handleKeyPress={handleKeyPress}
                        />
                    </section>

                    {/* ✅ 섹션 3 - 결과 */}
                    {hasSearched && searchResult && (
                        <section style={sectionStyle(sectionIndex === 2)}>
                            <SearchResultSection
                                results={searchResult}
                                keyword={keyword}
                                setKeyword={setKeyword}
                                handleKeyPress={handleKeyPress}
                                handleSearch={handleSearch}
                                setSectionIndex={setSectionIndex}
                                setOffset={setOffset} // ✅ 추가
                                isLoading={isLoading} // ✅ 추가
                                tripPlanOffset={tripPlanOffset}           // ✅ 추가
                                setTripPlanOffset={setTripPlanOffset}     // ✅ 추가
                            />
                        </section>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default Home;
