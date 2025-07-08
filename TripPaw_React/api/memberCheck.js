// api/memberCheck.js
import axios from 'axios';

const API_BASE = '/api/member-checks';

export const getMemberChecksByRoutineId = async (routineId) => {
  const res = await axios.get(`${API_BASE}/routine/${routineId}`);
  return res.data;
};

// 멤버 기준으로 체크리스트를 불러올 때 루틴 정보도 포함되도록 수정
export const getMemberChecksByMemberId = async (memberId) => {
  const res = await axios.get(`${API_BASE}/member/${memberId}`);
  return res.data;
};

// 항목 수정 (custom_content 업데이트)
export const updateMemberCheck = async (itemId, content) => {
  const res = await axios.put(`${API_BASE}/${itemId}`, { custom_content: content });
  return res.data;
};

// 항목 추가
export const addMemberCheck = async (newItem) => {
  const res = await axios.post(`${API_BASE}`, {
    custom_content: newItem.custom_content, // custom_content 포함
    routineId: newItem.routineId, // checkroutine_id 값 추가
  });
  return res.data;
};