import React from 'react';

const itemWrapper = {
    //border: '2px solid black',
    display: 'flex',
    padding: '10px',
    margin: '20px',
}
const dayWrapper = {
    //border: '2px solid red',
    backgroundColor: 'rgba(189, 189, 189, 0.29)',
    width: '90px',
    padding: '20px',
    borderRadius: '30px',
    marginRight: '10px',
    display: 'flex',
    justifyContent: 'center', // 수평 가운데
    alignItems: 'center',     // 수직 가운데
    height: '15px',          // 높이 있어야 수직 정렬 가능
    coler: 'rgba(90, 90, 90, 0.65)',
}

const items = {
    //border: '2px solid purple',
    alignItems: 'center',
    fontSize: 'bold',
}

const dividerLine = {
    width: '90%',
    border: '1px solid rgba(204, 204, 204, 0.9)',
    height: '1px',
    margin: 'auto',
};

const DayScheduleItem = ({ day, isActive, onClick }) => (
    <div>
        <div
            style={itemWrapper}
            onClick={onClick}
        >
            <div style={dayWrapper}>{day.day}일차</div>
            {day.places.map((place, idx) => (
                <div key={place.placeId} style={items}>
                    {place.name}
                </div>
            ))}
        </div>
        <div style={dividerLine} />
    </div >
);

export default DayScheduleItem;