import React, { useRef, useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import TripPlanMain from '../components/tripPlan/TripPlanMain';
import TripPlanSearch from '../components/search/TripPlanSearch';
import SearchResultSection from '../components/search/SearchResultSection';
import axios from 'axios';

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

    // 🔍 검색 요청 핸들러
    const handleSearch = async () => {
        if (!keyword.trim()) return;
        try {
            const res = await axios.get(`/search?keyword=${encodeURIComponent(keyword)}`);
            setSearchResult(res.data);
            setHasSearched(true);
            setSectionIndex(2);
        } catch (err) {
            console.error('❌ 검색 실패:', err);
        }
    };

    // ⌨️ 엔터 키 핸들러
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // 🖱️ 마우스 휠로 스크롤 전환
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

    // 🎯 섹션 스크롤 이동
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

    // ✋ 바디 스크롤 막기
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
                            handleSearch={handleSearch}
                            handleKeyPress={handleKeyPress}
                        />
                    </section>

                    {/* ✅ 섹션 3 - 결과 */}
                    {hasSearched && (
                        <section style={sectionStyle(sectionIndex === 2)}>
                            <SearchResultSection
                                results={searchResult}
                                keyword={keyword}
                                setKeyword={setKeyword}
                                handleKeyPress={handleKeyPress}
                                handleSearch={handleSearch}
                                setSectionIndex={setSectionIndex}
                            />
                        </section>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default Home;
