import React from 'react';
import SearchResultCard from './SearchResultCard';

const SearchResultList = ({ places }) => {
    console.log('places : ', places);

    return (
        <div className="flex flex-wrap justify-center">
            {places.map((place) => (
                <SearchResultCard key={place.id} place={place} />
            ))}
        </div>
    );
};

export default SearchResultList;
