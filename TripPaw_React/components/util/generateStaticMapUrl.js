// utils/generateStaticMapUrl.js
/* 
const generateStaticMapUrl = (routeData) => {
    if (!routeData || routeData.length === 0) return '';

    const coords = routeData.flatMap((day) =>
        day.places.map((p) => `${p.latitude},${p.longitude}`)
    );

    if (coords.length === 0) return '';

    const center = coords[Math.floor(coords.length / 2)];
    const baseUrl = 'https://map.kakao.com/staticmap';
    const appkey = process.env.NEXT_PUBLIC_KAKAO_KEY || 'dd83c711edfa536595c191a7a73247a9';

    const params = new URLSearchParams({
        appkey,
        center,
        level: '6',
        w: '600',
        h: '400',
        line: coords.join('|'),
        marker: coords.join('|'),
    });

    return `${baseUrl}?${params.toString()}`;
};

export default generateStaticMapUrl;
*/

// utils/fetchMapThumbnail.js
import axios from 'axios';

/**
 * 백엔드로 경로 데이터를 보내고 정적 지도 이미지를 받아옵니다
 * @param {Array} routeData - 여행 일자별 장소 데이터
 * @returns {string} 이미지 URL 또는 null
 */
const fetchMapThumbnail = async (routeData) => {
    if (!routeData || routeData.length === 0) return null;

    // 경로 좌표 추출
    const coords = routeData.flatMap((day) =>
        day.places.map((p) => `${p.latitude},${p.longitude}`)
    );

    if (coords.length === 0) return null;

    // center는 경로의 중간 지점
    const center = coords[Math.floor(coords.length / 2)];

    try {
        const response = await axios.post('/api/map-thumbnails', {
            center,
            level: 6,
            width: 600,
            height: 400,
            coords, // 마커/선용 좌표
        });

        return response.data.imageUrl; // 서버에서 반환하는 이미지 경로
    } catch (error) {
        console.error('정적 지도 요청 실패:', error);
        return null;
    }
};

export default fetchMapThumbnail;
