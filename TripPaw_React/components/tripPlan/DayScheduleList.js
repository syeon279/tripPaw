import React, { useRef } from 'react';
import DayScheduleItem from './DayScheduleItem';
import ActionButtons from './ActionButtons';

const DayScheduleList = ({ routeData, currentDay, onSelectDay, onPlaceClick, setFocusDay }) => {
    const dayRefs = useRef([]);

    const handleDayClick = (dayIndex) => {
        onSelectDay(dayIndex);
        dayRefs.current[dayIndex - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div>
            {routeData.map((day, index) => (
                <div key={day.day} ref={(el) => (dayRefs.current[index] = el)} style={{ marginBottom: '16px' }}>
                    <DayScheduleItem
                        day={day}
                        isActive={day.day === currentDay}
                        onClick={() => handleDayClick(day.day)}
                        onPlaceClick={(place) => { setFocusDay(day.day); onPlaceClick(place, day.day) }}
                    />
                </div>
            ))}
        </div>
    );
};

export default DayScheduleList;
