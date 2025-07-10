import React, { useRef } from 'react';
import DayScheduleItem from './DayScheduleItem';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const DayScheduleList2 = ({
    routeData,
    currentDay,
    onSelectDay,
    onPlaceClick,
    setFocusDay,
    onDeletePlace,
    setRouteData,
}) => {
    const dayRefs = useRef([]);
    const sensors = useSensors(useSensor(PointerSensor));

    const handleDayClick = (dayIndex) => {
        onSelectDay(dayIndex);
        setFocusDay(dayIndex); // ✅ 지도에 해당 일차만 표시되도록 추가
        dayRefs.current[dayIndex - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const sourceDayIndex = parseInt(active.id.split('-')[1]);
        const destDayIndex = parseInt(over.id.split('-')[1]);

        const updatedData = [...routeData];
        const sourceDay = updatedData.find((d) => d.day === sourceDayIndex);
        const destDay = updatedData.find((d) => d.day === destDayIndex);

        if (!sourceDay || !destDay) return;

        const oldIndex = sourceDay.places.findIndex((p) => p.draggableId === active.id);
        const newIndex = destDay.places.findIndex((p) => p.draggableId === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const [moved] = sourceDay.places.splice(oldIndex, 1);
        destDay.places.splice(newIndex, 0, moved);

        const fullySynced = updatedData.map((day) => ({
            ...day,
            places: day.places.map((p) => ({
                ...p,
                draggableId: `day-${day.day}-place-${p.placeId}`,
            })),
        }));

        setRouteData(fullySynced);
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
                items={routeData.flatMap((day) => day.places.map((p) => p.draggableId))}
                strategy={verticalListSortingStrategy}
            >
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
                        {day.places.map((place) => (
                            <DayScheduleItem
                                key={place.draggableId}
                                day={day}
                                place={place}
                                isActive={day.day === currentDay}
                                onPlaceClick={(p) => {
                                    if (
                                        typeof window !== 'undefined' &&
                                        window.kakao &&
                                        window.kakao.maps &&
                                        window.kakao.maps.LatLng
                                    ) {
                                        setFocusDay(day.day);
                                        onPlaceClick(p, day.day);
                                    } else {
                                        console.warn('⚠️ kakao.maps.LatLng is not available yet.');
                                    }
                                }}
                                onDeletePlace={onDeletePlace}
                            />
                        ))}
                    </div>
                ))}
            </SortableContext>
        </DndContext>
    );
};

export default DayScheduleList2;
