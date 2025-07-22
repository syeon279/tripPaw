// pages/tripPlan/myTripsPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AppLayout from '../../components/AppLayout';

const header = {
    width: '100%',
    height: '120px'
}


const MyTripsPage = () => {
    //console.log('🐢 tripPlan/list 도착');
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        axios.get('/tripPlan/list', { withCredentials: true })
            .then(res => setTrips(res.data))
            .catch(err => console.error('여행 목록 불러오기 실패:', err));
    }, []);
    console.log('✏ trips : ', trips);

    if (trips.length === 0) {
        return <AppLayout>
            <div style={header} />
            <div style={{ padding: 20 }}>저장된 여행이 없습니다.</div>
        </AppLayout>;
    }

    return (
        <AppLayout>
            <div style={header} />
            <div style={{ padding: 24 }}>
                <h2 style={{ marginBottom: 16 }}>내 여행 목록</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                    {trips.map((trip) => (
                        <div key={trip.id} style={{
                            width: 240,
                            border: '1px solid #ddd',
                            borderRadius: 10,
                            padding: 12,
                            background: '#fafafa'
                        }}>
                            <img
                                src={`trip.imageUrl`}
                                alt="썸네일"
                                style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 6 }}
                            />
                            <h4>{trip.title}</h4>
                            <div style={{ fontSize: 14, color: '#555' }}>
                                {trip.days}
                            </div>
                            <div style={{ fontSize: 13, color: '#888' }}>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
};

export default MyTripsPage;
