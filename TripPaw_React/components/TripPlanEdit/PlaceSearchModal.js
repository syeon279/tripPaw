import React, { useState } from 'react';
import axios from 'axios';

const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    width: '400px',
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

    return (
        <>
            <div style={overlayStyle} onClick={onClose} />
            <div style={modalStyle}>
                <h3>장소 검색</h3>
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="장소 이름 입력"
                    style={{ width: '100%', marginBottom: '10px' }}
                />
                <button onClick={handleSearch}>검색</button>

                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {results.map((place) => (
                        <li
                            key={place.id}
                            style={{
                                margin: '10px 0',
                                borderBottom: '1px solid #ddd',
                                paddingBottom: '8px',
                            }}
                        >
                            <div>{place.name}</div>
                            <button onClick={() => onSelectPlace(place)}>추가</button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default PlaceSearchModal;
