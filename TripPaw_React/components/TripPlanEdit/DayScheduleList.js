import React, { useRef } from 'react';
import DayScheduleItem from './DayScheduleItem';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const DayScheduleList = ({
    routeData,
    currentDay,
    onSelectDay,
    onPlaceClick,
    setFocusDay,
    onDeletePlace,
    setRouteData,
}) => {
    const dayRefs = useRef([]);

    const handleDayClick = (dayIndex) => {
        onSelectDay(dayIndex);
        dayRefs.current[dayIndex - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const sourceDayIndex = parseInt(source.droppableId.split('-')[1]);
        const destDayIndex = parseInt(destination.droppableId.split('-')[1]);

        const updatedData = [...routeData];

        const sourceDay = updatedData.find((d) => d.day === sourceDayIndex);
        const destDay = updatedData.find((d) => d.day === destDayIndex);

        const [movedPlace] = sourceDay.places.splice(source.index, 1);

        if (sourceDayIndex === destDayIndex) {
            // 같은 일차 내에서 이동
            sourceDay.places.splice(destination.index, 0, movedPlace);
        } else {
            // 다른 일차로 이동
            destDay.places.splice(destination.index, 0, movedPlace);
        }

        setRouteData(updatedData);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            {routeData.map((day, index) => (
                <div
                    key={day.day}
                    ref={(el) => (dayRefs.current[index] = el)}
                    style={{ marginBottom: '16px' }}
                >
                    <div
                        onClick={() => handleDayClick(day.day)}
                        style={{
                            fontWeight: day.day === currentDay ? 'bold' : 'normal',
                            cursor: 'pointer',
                            marginBottom: '8px',
                        }}
                    >
                    </div>

                    <Droppable droppableId={`day-${day.day}`}>
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {day.places.map((place, idx) => (
                                    <Draggable
                                        key={`place-${place.placeId}`}
                                        draggableId={`place-${place.placeId}`}
                                        index={idx}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <DayScheduleItem
                                                    day={day}
                                                    place={place}
                                                    isActive={day.day === currentDay}
                                                    onPlaceClick={() => {
                                                        setFocusDay(day.day);
                                                        onPlaceClick(place, day.day);
                                                    }}
                                                    onDeletePlace={onDeletePlace}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            ))}
        </DragDropContext>
    );
};

export default DayScheduleList;
