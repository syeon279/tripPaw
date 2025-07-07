import React, { useEffect, useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import Meta from 'antd/lib/card/Meta';

const SearchResultSection = ({
    results,
    keyword,
    setKeyword,
    handleSearch,
    handleKeyPress,
    setSectionIndex
}) => {
    const [filteredResults, setFilteredResults] = useState(results);

    useEffect(() => {
        if (!keyword.trim()) {
            setFilteredResults(results);
            return;
        }

        const lowerKeyword = keyword.toLowerCase();
        const { places = [], tripPlans = [] } = results;

        const filteredPlaces = places.filter((place) =>
            place.name.toLowerCase().includes(lowerKeyword)
        );
        const filteredTripPlans = tripPlans.filter((plan) =>
            plan.title.toLowerCase().includes(lowerKeyword)
        );

        setFilteredResults({
            places: filteredPlaces,
            tripPlans: filteredTripPlans,
        });
    }, [keyword, results]);

    if (!results) return <div>검색 결과가 없습니다.</div>;

    const { places = [], tripPlans = [] } = filteredResults;

    const boxStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '24px',
        borderRadius: '16px',
        width: '100%',
        color: 'black',
        marginTop: '50px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.52)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    };

    const inputStyle = {
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
        width: '80%',
        marginRight: '20px',
        fontSize: '1.1rem',
    };

    const resultCardWrapper = {
        margin: '30px',
        padding: '0',
    };

    const titleStyle = {
        //border: '2px solid red',
        color: 'white',
        display: 'block',
        fontSize: '1.5em',
        marginTop: '20px',
    };

    const resultScrollContainer = {
        border: '2px solid blue',
        //paddingRight: '10px',
        //paddingBottom: '8px',
        padding: '0px',
        marginTop: '16px',
        // 스크롤바 숨김
        scrollbarWidth: 'none',         // Firefox
        msOverflowStyle: 'none',        // IE/Edge
        overflowY: 'auto',
        overflowX: 'auto', // 가로 스크롤 활성화
        whiteSpace: 'nowrap',
        scrollBehavior: 'smooth',

    };

    const resultCard = {
        border: '2px solid black',
        display: 'flex',
        width: '100%',
        //height: '100%',
        //margin: '10px',
        overflowX: 'auto', // 가로 스크롤 활성화
        whiteSpace: 'nowrap',
        scrollBehavior: 'smooth',
        /* 아래 스크롤바 숨김 */
        scrollbarWidth: 'none',        // Firefox용
        msOverflowStyle: 'none',       // IE용
    };

    const resultItems = {
        border: '1px solid red',
        borderRadius: '16px',
        marginBottom: '16px',
        backgroundColor: 'white',
        margin: '20px',
        //height: '200px',
        //overflow: 'hidden', // 내부 넘치는 내용 방지
        display: 'inline-block', // 가로 정렬 유지
    };


    return (
        <div
            style={{
                width: '100%',
                maxWidth: '960px',
                //height: '90vh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* 검색창 */}
            <div style={boxStyle}>
                <ArrowLeftOutlined
                    onClick={() => setSectionIndex(0)} //클릭 시 1세션으로 이동
                />
                <input
                    style={inputStyle}
                    type="text"
                    placeholder="검색어로 결과를 다시 필터링해보세요"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
            </div>

            <div style={titleStyle}>
                <h3 style={{ color: 'white' }}> 이런 장소는 어떠세요? </h3>
                <div> 검색하신 키워드에 맞는 장소를 찾아왔어요! </div>
            </div>

            {/* 🔽 장소 결과 스크롤 */}
            <div
                style={resultScrollContainer}
                onWheel={(e) => {
                    e.stopPropagation();
                    e.preventDefault(); // 기본 세로 스크롤 막음
                    e.currentTarget.scrollLeft += e.deltaY; // 세로 휠을 가로 이동으로 전환
                }}
            >
                <div style={resultCardWrapper}>
                    <div style={resultCard}>
                        {places.length === 0 ? (
                            <p>일치하는 장소가 없습니다.</p>
                        ) : (
                            places.map((place) => (
                                <Card
                                    key={place.id}
                                    style={resultItems}
                                    cover={
                                        <img
                                            alt="example"
                                            src={place.imageUrl}
                                            style={{
                                                width: '100%',
                                                maxHeight: '100px',
                                                objectFit: 'cover',
                                                borderRadius: '16px 16px 0 0',
                                            }}
                                        />
                                    }
                                >
                                    <Meta
                                        title={place.name}
                                        description={
                                            <>
                                                <p>{place.region}</p>
                                                <p>{place.openHours}</p>
                                                <p>🚘 {place.parking}</p>
                                            </>
                                        }
                                    />
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div >

            <h2>🗺️ 여행 코스 검색 결과</h2>

            {/* 🔽 여행 코스 결과 스크롤 */}
            <div
                style={resultScrollContainer}
                onWheel={(e) => e.stopPropagation()}
            >
                <div>
                    {tripPlans.length === 0 ? (
                        <p>일치하는 여행 코스가 없습니다.</p>
                    ) : (
                        tripPlans.map((plan) => (
                            <div
                                key={plan.id}
                                style={{
                                    border: '1px solid #aaa',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    marginBottom: '16px',
                                    backgroundColor: '#f9f9f9',
                                }}
                            >
                                <h3>{plan.title}</h3>
                                <p>기간: {plan.days}일</p>
                                {plan.imageUrl && (
                                    <img
                                        src={plan.imageUrl}
                                        alt={plan.title}
                                        style={{
                                            width: '100%',
                                            maxHeight: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                        }}
                                    />
                                )}
                                <p>작성일: {new Date(plan.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div >
    );
};

export default SearchResultSection;
