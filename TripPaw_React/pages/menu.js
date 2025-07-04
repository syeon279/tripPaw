import React, { useRef, useEffect, useState } from 'react';
import Router from 'next/router';
import AppLayout from '../components/AppLayout';

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
    contentWrapper: {
        width: '70%',
        height: '80%',
        justifyContent: 'center',
        margin: 'auto',
    },
    contentBox: {
        display: 'flex',
        width: '100%',
        height: '80%',
        justifyContent: 'center',
        margin: 'auto',
    },
    mapContainer: {
        flex: 5,
        width: '100%',
        height: '100%',
    },
    scheduleContainer: {
        flex: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        overflowY: 'auto',
        maxHeight: '600px',
        paddingRight: '8px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        overscrollBehavior: 'contain',
    },
};

const Menu = () => {

    const menuItem = {
        fontSize: '3em',
    }
    return (
        <AppLayout >
            <div style={layoutStyle.header} />
            <div>
                <div style={menuItem}>홈</div>
                <div style={menuItem}>리뷰</div>
                <div style={menuItem} >나의 채팅</div>
                <div style={menuItem}>로그인</div>
            </div>
        </AppLayout>
    );
};

export default Menu;
