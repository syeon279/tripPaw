import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { format, addDays, eachDayOfInterval, parseISO } from 'date-fns';
import axios from 'axios';

const tripPlanMain = () => {
    const containerStyle = {
        position: 'relative',
        width: '90%',
        height: '100vh',
        overflow: 'hidden',
        justifyContent: 'center',
        margin: 'auto',
        //border: '2px solid black'
    };

    const contentStyle = {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',  //수직 정렬
        padding: '20px',
        boxSizing: 'border-box',
        color: 'white',
        textAlign: 'center',

    };

    const boxStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '24px',
        borderRadius: '16px',
        width: '100%',
        justifyContent: 'center',
        color: 'black',
        marginTop: '50px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.52)',
        //border: '2px solid red'
    };

    const rowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        borderRadius: '8px',
        overflow: 'hidden',
        //border: '2px solid red',
    };


    const fieldStyle = {
        flex: 1,
        padding: '12px',
        justifyContent: 'space-between',
        //boxSizing: 'border-box',
        //border: '2px solid black',
    };

    const dividerStyle = {
        width: '1px',
        border: '1px solid rgba(221, 220, 220, 0.9)',
        height: '80px',
        margin: '10px',
        //border: '2px solid red',
    };

    const inputStyle = {
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
        width: '30px',
        //marginRight: '5px',
        padding: '0px',
        //border: '2px solid blue'
    }

    const selectStyle = {
        width: '100%',
        padding: '4px',
        borderRadius: '4px',
        backgroundColor: 'transparent',
        border: 'none',
        //borderBottom: '1px solid #ccc',
        padding: '4px 0',
        fontSize: '14px',
        textAlign: 'center',
        //appearance: 'none',         // 브라우저 기본 스타일 제거
        //WebkitAppearance: 'none',   // 사파리용
        //MozAppearance: 'none',      // 파이어폭스용
    }

    // 지난 날짜 막기
    const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식



    // 폼 데이터 보내기
    const [region, setRegion] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [categories, setCategories] = useState([]);
    const [countPeople, setCountPeople] = useState(1);
    const [countPet, setCountPet] = useState(0);

    // 카테고리
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // 카테고리 꺼내오기
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/category', { withCredentials: true, });
                setCategories(response.data);
            } catch (error) {
                console.error('카테고리 불러오기 실패:', error);
            }
        };

        fetchCategories();
    }, []);

    // 드롭다운 바깥 클릭시 닫히는거 
    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    //폼 서브밋
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // ✅ 유효성 검사: 지역 선택 확인
        if (!region) {
            alert('여행 지역을 선택해주세요.');
            return;
        }
        if (!region) {
            return alert("지역을 선택해주세요");
        }
        if (!startDate || !endDate) {
            return alert("여행 일정을 입력해주세요");
        }
        if (countPeople <= 0) {
            return alert("동행 인원 수는 1명 이상이어야 합니다");
        }
        if (!selectedCategories || selectedCategories.length === 0) {
            return alert("카테고리를 하나 이상 입력해주세요");
        }

        const requestData = {
            region,
            startDate,
            endDate,
            countPeople,
            countPet,
            selectedCategoryIds: selectedCategories,
        };

        try {
            const response = await axios.post('http://localhost:8080/tripPlan/recommend', requestData, {
                withCredentials: true,
            });

            // 데이터 보내기
            router.push({
                pathname: '/tripPlan/routeRecommendPage',
                query: {
                    data: encodeURIComponent(JSON.stringify(response.data)), // 추천 경로
                    req: encodeURIComponent(JSON.stringify(requestData)),    // 여행 기본정보
                },
            });

            console.log('😁 여행 일정 : ', requestData);

        } catch (error) {
            console.error('추천 실패:', error);
        }
    };


    // 카테고리 색상 바뀌기
    const tagColors = [
        'rgba(76, 108, 250, 0.9)',
        'rgba(255, 150, 63, 0.9)',
        'rgba(28, 170, 71, 0.9)',
        'rgba(250, 39, 197, 0.9)',
        'rgba(58, 223, 86, 0.9)',
        'rgba(223, 231, 105, 0.9)',
        'rgba(176, 162, 235, 0.9)',
        'rgba(255, 24, 62, 0.9)',
        'rgba(23, 216, 250, 0.9)',
        'rgba(75, 160, 54, 0.9)',
    ];

    return (
        <form onSubmit={handleSubmit} style={{ flex: 1 }}>
            <div style={containerStyle}>
                {/* <img src="/image/background/main.png" alt="background" style={backgroundStyle} /> */}

                <div style={contentStyle}>
                    <div style={{ width: '90%', margin: '0 auto' }}>
                        <Image src="/image/logo/TripPaw-logo-white.png" alt="logo" width={480}
                            height={120}
                            priority />
                        <div style={boxStyle}>
                            <div style={rowStyle}>
                                {/* 여행지 */}
                                <div style={fieldStyle}>
                                    <label style={{ fontSize: '14px', marginBottom: '10px', display: 'block' }}>여행지</label>
                                    <select style={selectStyle} value={region} onChange={(e) => setRegion(e.target.value)}>
                                        <option value="">-- 지역 선택 --</option>
                                        <option value="서울">서울</option>
                                        <option value="부산">부산</option>
                                        <option value="제주">제주</option>
                                        <option value="인천">인천</option>
                                        <option value="광주">광주</option>
                                        <option value="대전">대전</option>
                                        <option value="울산">울산</option>
                                        <option value="경기">경기</option>
                                        <option value="강원">강원</option>
                                        <option value="충청">충청</option>
                                        <option value="전라">전라</option>
                                        <option value="경북">경북</option>
                                        <option value="경상">경상</option>
                                    </select>
                                </div>

                                <div style={dividerStyle} />

                                {/* 여행 일자 */}
                                <div style={fieldStyle}>
                                    <label style={{ fontSize: '14px', marginBottom: '10px', display: 'block' }}>여행 일자</label>
                                    <div style={{ display: 'flex', gap: '8px', padding: '0px', }}>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            placeholder="시작일"
                                            min={today}
                                            style={{
                                                ...inputStyle,
                                                width: '100%',
                                                borderBottom: '1px solid #ccc',
                                                paddingBottom: '4px',
                                                fontSize: '14px',
                                                color: startDate ? 'black' : '#aaa',
                                            }}
                                        />
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            placeholder="종료일"
                                            min={startDate || today}
                                            style={{
                                                ...inputStyle,
                                                width: '100%',
                                                borderBottom: '1px solid #ccc',
                                                paddingBottom: '4px',
                                                fontSize: '14px',
                                                color: endDate ? 'black' : '#aaa',
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={dividerStyle} />

                                {/* 동행 */}
                                <div style={fieldStyle}>
                                    <label style={{ fontSize: '14px', marginBottom: '10px', display: 'block' }}>동행</label>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '0px', }}>
                                        <input style={inputStyle} type="number" value={countPeople} min="1"
                                            onChange={(e) => setCountPeople(Number(e.target.value))} /> 명
                                        <div style={{
                                            width: '1px',
                                            border: '1px solid rgba(221, 220, 220, 0.9)',
                                            height: '30px',
                                            margin: '10px',
                                            //marginRight: '15px'
                                        }}></div>
                                        <input style={inputStyle} type="number" value={countPet} min="0" onChange={(e) => setCountPet(Number(e.target.value))} /> 견
                                    </div>
                                    <div>
                                    </div>
                                </div>

                                <div style={dividerStyle} />

                                {/* 여행 테마*/}
                                <div style={{ position: 'relative' }}>
                                    {/* 선택된 카테고리들 */}
                                    <div
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        onWheel={(e) => e.stopPropagation()}
                                        style={{
                                            minHeight: '40px',
                                            borderRadius: '8px',
                                            padding: '8px',
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '8px',
                                            cursor: 'pointer',
                                            //backgroundColor: '#fff',
                                            maxHeight: '100px',
                                            width: '300px',
                                            maxWidth: '300px',
                                            overflowY: 'auto',
                                            /* 👇 스크롤 숨기기 */
                                            scrollbarWidth: 'none',       // Firefox
                                            msOverflowStyle: 'none',      // IE, Edge
                                        }}
                                    >
                                        {selectedCategories.length === 0 && <span style={{ color: '#aaa' }}>테마를 선택하세요</span>}
                                        {selectedCategories.map((categoryId, index) => {
                                            const category = categories.find(c => c.id === parseInt(categoryId));
                                            const color = tagColors[index % tagColors.length]; // 색상 반복
                                            return (
                                                <span
                                                    key={categoryId}
                                                    style={{
                                                        backgroundColor: color,
                                                        color: 'white',
                                                        padding: '4px 8px',
                                                        borderRadius: '16px',
                                                        fontSize: '13px',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        position: 'relative',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.querySelector('button').style.visibility = 'visible';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.querySelector('button').style.visibility = 'hidden';
                                                    }}
                                                >
                                                    {category?.name}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedCategories(prev =>
                                                                prev.filter((id) => id !== categoryId)
                                                            );
                                                        }}
                                                        style={{
                                                            background: 'transparent',
                                                            border: 'none',
                                                            color: 'white',
                                                            cursor: 'pointer',
                                                            fontWeight: 'bold',
                                                            fontSize: '14px',
                                                            visibility: 'hidden',
                                                            padding: '0 4px',
                                                            lineHeight: '1',
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            );
                                        })}
                                    </div>

                                    {/* 드롭다운 */}
                                    {isDropdownOpen && (
                                        <div
                                            ref={dropdownRef}
                                            onWheel={(e) => e.stopPropagation()}
                                            style={{
                                                position: 'fixed',
                                                top: '70%',
                                                left: '60%',
                                                transform: 'translate(-50%, -50%)',
                                                width: '320px',
                                                maxHeight: '300px',
                                                backgroundColor: 'white',
                                                padding: '16px',
                                                zIndex: 1000,
                                                overflowY: 'auto',
                                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.38)',
                                                /* 👇 스크롤 숨기기 */
                                                scrollbarWidth: 'none',       // Firefox
                                                msOverflowStyle: 'none',      // IE, Edge
                                                overscrollBehavior: 'contain', // 스크롤 바운스 방지
                                            }}
                                        >
                                            <div style={{ marginBottom: '12px', fontWeight: 'bold' }}>여행 테마 선택</div>
                                            {categories.map(category => (
                                                <label
                                                    key={category.id}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10px',
                                                        padding: '6px 0',
                                                        fontSize: '15px',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        value={category.id}
                                                        checked={selectedCategories.includes(String(category.id))}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (e.target.checked) {
                                                                setSelectedCategories(prev => [...prev, value]);
                                                            } else {
                                                                setSelectedCategories(prev => prev.filter(id => id !== value));
                                                            }
                                                        }}
                                                    />
                                                    {category.name}
                                                </label>
                                            ))}
                                            <div style={{ marginTop: '16px', textAlign: 'right' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        backgroundColor: '#0c9397',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    선택 완료
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>


                                <div style={{ marginRight: '100px' }}>

                                </div>


                                {/* 버튼 */}
                                <div style={fieldStyle}>
                                    <button
                                        type='submit'
                                        style={{
                                            backgroundColor: 'rgba(18, 137, 173, 0.9)',
                                            color: 'white',
                                            padding: '8px 24px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '16px',
                                            marginTop: '20px',
                                            width: '80%',
                                        }}
                                    >
                                        여행가기
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default tripPlanMain;