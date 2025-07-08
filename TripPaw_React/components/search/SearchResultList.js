import React from 'react';
import { useRouter } from 'next/router';
import SearchResultCard from './SearchResultCard';

const SearchResultList = ({ places }) => {
    const router = useRouter();

    const handleClick = (placeId) => {
        router.push(`/place/${placeId}`);
    };

    return (
        <div className="flex flex-wrap justify-center">
            {places.map((place) => (
                <SearchResultCard
                    key={place.id}
                    place={place}
                    onClick={() => handleClick(place.id)}
                />
            ))}
        </div>
    );
};

export default SearchResultList;
