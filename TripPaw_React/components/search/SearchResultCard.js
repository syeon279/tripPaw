import React from 'react';
import { Card } from 'antd';

const { Meta } = Card;

const SearchResultCard = ({ place, onClick }) => {
    return (
        <div className="m-2 cursor-pointer" onClick={onClick}>
            <Card
                hoverable
                style={{ width: 240 }}
                cover={<img alt={place.name} src={place.imageUrl} />}
            >
                <Meta title={place.name} description={place.description} />
            </Card>
        </div>
    );
};

export default SearchResultCard;
