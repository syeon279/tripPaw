import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';

const API_BASE = '/api/check-templates';

export const getTemplates = async()=>{
  const res = await axios.get(API_BASE);
  return res.data;
};

export const getTemplateDetail = async(id)=>{
  await axios.post(`${API_BASE}/${id}`);
};

export const createTemplate = async(data)=>{
  await axios.post(API_BASE, data);
};

export const updateTemplate = async(id, data)=>{
  await axios.put(`${API_BASE}/${id}`, data);
};

export const deleteTemplate = async(id)=>{
  await axios.delete(`${API_BASE}/${id}`);
};

export const getAllTemplateItems = async () =>{
  const res = await axios.get(`${API_BASE}/item/all`);
  return res.data;
};