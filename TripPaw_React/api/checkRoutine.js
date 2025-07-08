//api/checkRoutine.js
import axios from 'axios';

const API_BASE = '/api/routine';

// 루틴 단일 조회 (항목 포함)
export const getRoutineWithItems = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};

// 루틴 전체 조회 (특정 유저용)
export const getRoutinesByMember = async (memberId) => {
  const res = await axios.get(`${API_BASE}/member/${memberId}`);
  return res.data;
};

// 루틴 생성
export const createRoutine = async (routine) => {
  const res = await axios.post(`${API_BASE}`, routine);
  return res.data;
};

// 루틴 수정
export const updateRoutine = async (id, routine) => {
  const res = await axios.put(`${API_BASE}/${id}`, routine);
  return res.data;
};

// 루틴 삭제
export const deleteRoutine = async (id) => {
  const res = await axios.delete(`${API_BASE}/${id}`);
  return res.data;
};
