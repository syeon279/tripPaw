import React from 'react';

const SearchResultCard = ({ place }) => {
    const {
        name,
        region,
        petFriendly,
        rating,
        reviewCount,
        likeCount,
        placeImages,
        placeType,
    } = place;

    console.log('place : ', place);

    const imageUrl =
        placeImages && placeImages.length > 0
            ? placeImages[0].imageUrl
            : 'public/image/other/tempImage.jpg'; // 대체 이미지 경로

    return (
        <div className="w-64 h-80 rounded-xl shadow-md overflow-hidden bg-white m-2">
            <img
                src={imageUrl}
                alt={name}
                className="w-full h-40 object-cover"
            />
            <div className="p-3">
                <div className="text-sm text-gray-600">{placeType?.name || '카테고리'}</div>
                <div className="font-bold text-lg mt-1 truncate">{name}</div>
                <div className="text-sm text-gray-500">{region} · {petFriendly ? '반려동물 동반 가능' : '동반 불가'}</div>
                <div className="text-sm text-red-600 mt-2">
                    ★ {rating?.toFixed(1) || '0.0'} 리뷰 {reviewCount || 0} · 찜 {likeCount || 0}
                </div>
            </div>
        </div>
    );
};

export default SearchResultCard;
