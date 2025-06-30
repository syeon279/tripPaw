import React from 'react';

const Home = () => {
    return (
        <div className="w-full h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('image/background/main.png')" }}>
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-20 z-0" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
                <h1 className="text-5xl font-bold mb-12 flex items-center">
                    <span className="mr-2">Trip</span>
                    <span className="text-white">Paw</span>
                    <span className="ml-2 text-3xl">🐾</span>
                </h1>

                <div className="bg-white p-6 rounded-2xl shadow-lg text-black w-full max-w-4xl">
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-sm mb-1">지역 선택</label>
                            <select className="w-full border rounded px-2 py-1">
                                <option>서울</option>
                                <option>부산</option>
                                <option>제주</option>
                                {/* ... */}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm mb-1">여행 목적</label>
                            <select className="w-full border rounded px-2 py-1">
                                <option>힐링</option>
                                <option>액티비티</option>
                                <option>문화탐방</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm mb-1">동행</label>
                            <select className="w-full border rounded px-2 py-1">
                                <option>혼자</option>
                                <option>반려견</option>
                                <option>가족</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm mb-1">날씨 조건</label>
                            <div className="flex gap-2 flex-wrap">
                                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-sm">맑음</span>
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">흐림</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button className="bg-teal-400 text-white px-6 py-2 rounded-lg hover:bg-teal-500 transition">
                            여행 추천받기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
