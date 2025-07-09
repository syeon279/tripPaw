import React, { useRef, useEffect } from 'react';
import Router from 'next/router';
import AppLayout from '../components/AppLayout';

const layoutStyle = {
    header: { width: '100%', height: '80px' },
    dividerLine: {
        width: '100%',
        border: '1px solid rgba(170, 169, 169, 0.9)',
    },
};

const Menu = () => {
    const menuWrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuWrapperRef.current && !menuWrapperRef.current.contains(event.target)) {
                Router.back();
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const menuItem = {
        fontSize: '3em',
        margin: '10px',
        cursor: 'pointer',
    };

    const menuWrapper = {
        textAlign: 'center',
        padding: '10%',
    };

    const footer = {
        textAlign: 'center',
        padding: '10px',
    };

    const footerItemWrapper = {
        display: 'flex',
        justifyContent: 'center',
        margin: '5px',
    };

    const footerItems = {
        margin: '10px',
    };

    return (
        <AppLayout>
            <div style={layoutStyle.header} />
            <div style={{ backgroundColor: 'rgba(245, 244, 237, 0.7)', minHeight: '100vh' }}>
                <div ref={menuWrapperRef} style={menuWrapper}>
                    <div style={menuItem}>홈</div>
                    <div style={menuItem} onClick={() => Router.push('/review/route-review')}>리뷰</div>
                    <div style={menuItem}>나의 채팅</div>
                    <div style={menuItem}>로그인</div>
                </div>

                <div style={layoutStyle.dividerLine} />

                <div style={footer}>
                    <div style={footerItemWrapper}>
                        <div style={footerItems}> (주)쓰담 </div>
                        <div style={footerItems}> 대표 이사 윤소현 </div>
                        <div style={footerItems}> 사업자 등록번호 104-82-8282828 </div>
                    </div>
                    <div style={footerItemWrapper}>
                        <div style={footerItems}> 상담 문의 1544-5959</div>
                        <div style={footerItems}> 이메일 syeonblue@gmail.com</div>
                        <div style={footerItems}> 주소 인천 부평구 경원대로 1366 스테이션 타워 </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Menu;
