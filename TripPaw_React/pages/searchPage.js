import React, { useEffect, useState } from 'react';
import SearchResultList from '@/components/search/SearchResultList';
import axios from 'axios';
import AppLayout from '@/components/AppLayout';

const searchPage = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get('/api/search?keyword=카페').then((res) => {
      setPlaces(res.data.placeDtos); // ✅ 백엔드 응답 구조에 맞게 조정
    });
  }, []);

  return (
    <AppLayout>

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">이런 장소는 어떠세요?</h2>
        <SearchResultList places={places} />
      </div>
    </AppLayout>
  );
};

export default searchPage;
