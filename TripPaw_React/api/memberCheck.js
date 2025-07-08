// api/memberCheck.js
import axios from 'axios';

const API_BASE = '/api/member-checks';

// 루틴 기준 조회
export const getMemberChecksByRoutineId = async (routineId) => {
  const res = await axios.get(`${API_BASE}/routine/${routineId}`);
  return res.data;
};

// 멤버 기준조회
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
  try {
    if (!newItem.routineId) {
      throw new Error("Routine ID is required");
    }

    const res = await axios.post(`${API_BASE}`, {
      custom_content: newItem.custom_content, 
      checkRoutine: { id: newItem.routineId }, 
    });
    console.log(res.data);
  } catch (error) {
    console.error("Error adding member check:", error.message || error);
  }
};

//항목 삭제
export const deleteMemberCheck = async(itemId)=>{
  const res = await axios.delete(`${API_BASE}/${itemId}`);
  return res.data;
};