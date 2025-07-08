import React from 'react';
import { DeleteOutlined } from '@ant-design/icons';

const itemWrapper = {
    display: 'flex',
    padding: '10px',
    margin: '20px',
    cursor: 'pointer',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const dayWrapper = {
    backgroundColor: 'rgba(189, 189, 189, 0.29)',
    width: '90px',
    padding: '20px',
    borderRadius: '30px',
    marginRight: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '15px',
    color: 'rgba(90, 90, 90, 0.65)',
};

const placeInfo = {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
};

const DayScheduleItem = ({ day, place, onPlaceClick, onDeletePlace }) => {
    return (
        <div
            style={itemWrapper}
            onClick={(e) => {
                onPlaceClick(place);
                e.stopPropagation();
            }}
        >
            <div style={dayWrapper}>{day.day}일차</div>
            <div style={placeInfo}>
                <div>{place.name}</div>
                <DeleteOutlined
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeletePlace(day.day, place.placeId);
                    }}
                />
            </div>
        </div>
    );
};

export default DayScheduleItem;
