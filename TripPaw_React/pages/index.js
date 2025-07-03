import React, { useRef, useEffect, useState } from 'react';
import Router from 'next/router';
import AppLayout from '../components/AppLayout';
import TripPlanMain from '../components/tripPlan/TripPlanMain';
import TripPlanSearch from '../components/search/TripPlanSearch';

const sectionStyle = (isActive) => ({
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    //padding: '20px',
    opacity: isActive ? 1 : 0.2,
    transform: isActive ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(60px)',
    transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: isActive ? 2 : 1,
    filter: isActive ? 'brightness(1)' : 'brightness(0.7)',
});

const Home = () => {
    const containerRef = useRef(null);
    const [sectionIndex, setSectionIndex] = useState(0);
    const isScrollingRef = useRef(false);
    const sectionCount = 2;

    // 스크롤 핸들링
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

        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, [sectionIndex]);

    // 스크롤 이동
    useEffect(() => {
        const scrollToSection = () => {
            const container = containerRef.current;
            if (container) {
                container.scrollTo({
                    top: window.innerHeight * sectionIndex,
                    behavior: 'smooth',
                });
                setTimeout(() => {
                    isScrollingRef.current = false;
                }, 1000); // 스크롤 애니메이션 시간
            }
        };
        scrollToSection();
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
        <AppLayout headerTheme="white" >
            <div
                ref={containerRef}
                style={{
                    height: '100vh',
                    overflow: 'hidden',
                    width: '100%',
                    scrollBehavior: 'smooth',
                }}
            >
                <div
                    style={{
                        height: '200vh',
                        position: 'relative', // 추가!
                        backgroundImage: 'url("/image/background/index.png")',
                        backgroundAttachment: 'scroll',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'top center',
                    }}
                >
                    {/* 배경 위 밝은 오버레이 */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.4)', // 밝은 흰색 오버레이
                            zIndex: 0,
                        }}
                    />
                    <section style={sectionStyle(sectionIndex === 0)}>
                        <TripPlanMain />
                    </section>
                    <section style={sectionStyle(sectionIndex === 1)}>
                        <TripPlanSearch />
                    </section>
                </div>
            </div>
        </AppLayout>
    );
};

export default Home;
