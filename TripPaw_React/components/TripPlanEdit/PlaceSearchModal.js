import React, { useState, useMemo } from 'react';
import axios from 'axios';

const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    width: '500px',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 0 20px rgba(0,0,0,0.3)',
};

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 999,
};

const PlaceSearchModal = ({ onClose, onSelectPlace }) => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`/search?keyword=${encodeURIComponent(keyword)}`);
            console.log('검색 결과:', response.data);

            // ✅ `places` 배열로부터 추출
            const places = Array.isArray(response.data.places) ? response.data.places : [];

            setResults(places);
        } catch (err) {
            console.error('검색 실패:', err);
            setResults([]);
        }
    };

    const getFallbackImages = (items) => {
        const map = {};
        items.forEach(item => {
            const randomNum = Math.floor(Math.random() * 10) + 1;
            map[item.id] = `/image/other/randomImage/${randomNum}.jpg`;
        });
        return map;
    };

    const fallbackImages = useMemo(() => getFallbackImages(results), [results]);

    return (
        <>
            <div style={overlayStyle} onClick={onClose} />
            <div style={modalStyle}>
                {/* <h3>장소 검색</h3> */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ borderBottom: '2px solid rgba(155, 155, 155, 0.36)', width: '60%' }}>
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="장소 이름 입력"
                            style={{ width: '100%', marginBottom: '10px', border: 'none' }}
                        />
                    </div>
                    <button onClick={handleSearch} style={{ marginBottom: '10px', marginLeft: '5%', width: '20%', backgroundColor: 'black', color: 'white', fontWeight: 'bold' }}>찾아보기</button>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, marginTop: '30px' }}>
                    {results.map((place) => (
                        <li
                            key={place.id}
                            style={{
                                margin: '10px 0',
                                borderBottom: '1px solid #ddd',
                                paddingBottom: '8px',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <div style={{ display: 'flex' }}>
                                    <img
                                        src={place.imageUrl || fallbackImages[place.id]}
                                        alt={place.name}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            objectFit: 'cover',
                                            borderRadius: '0px'
                                        }}
                                    />
                                </div>
                                <div>
                                    <div style={{ margin: '10px' }}>{place.name}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <p style={{ fontSize: '14px', color: '#f44336', margin: 0 }}>
                                            {place.avgRating?.toFixed(1) || '0.0'}
                                        </p>
                                        <p style={{ fontSize: '14px', color: '#f44336', margin: 0 }}>
                                            {'★'.repeat(Math.floor(place.avgRating)) + '☆'.repeat(5 - Math.floor(place.avgRating))}
                                        </p>
                                        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                                            | 리뷰 {place.reviewCount || 0}
                                        </p>
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#666' }}>{place.region}</p>
                                </div>
                                <button
                                    onClick={() => onSelectPlace(place)}
                                    style={{ backgroundColor: 'black', color: 'white', height: '30px' }}
                                >추가</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default PlaceSearchModal;
