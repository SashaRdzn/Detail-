import axios from 'axios';

// const API_BASE_URL = 'http://127.0.0.1:8000/api';
const API_BASE_URL = 'http://192.168.0.102:8000/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API для работы с деталями
export const detailAPI = {
  // Получить все детали
  getAll: () => api.get('/details'),
  
  // Получить деталь по ID
  getById: (id) => api.get(`/detail/${id}`),
  
  // Создать новую деталь
  create: (data) => api.post('/details', data),
  
  // Обновить деталь
  update: (id, data) => api.put(`/detail/${id}`, data),
  
  // Удалить деталь
  delete: (id) => api.delete(`/detail/${id}`),
};

// API для работы с комментариями
export const reviewAPI = {
  // Получить все комментарии для детали
  getByDetailId: (detailId) => api.get(`/detail/${detailId}/reviews`),
  
  // Создать новый комментарий
  create: (detailId, data) => api.post(`/detail/${detailId}/reviews`, data),
  
  // Удалить комментарий
  delete: (reviewId) => api.delete(`/review/${reviewId}`),
};

// API для работы с группами
export const groupAPI = {
  // Получить все группы
  getAll: () => api.get('/groups'),
  
  // Получить группу по ID
  getById: (id) => api.get(`/group/${id}`),
  
  // Создать новую группу
  create: (data) => api.post('/groups', data),
  
  // Обновить группу
  update: (id, data) => api.put(`/group/${id}`, data),
  
  // Удалить группу
  delete: (id) => api.delete(`/group/${id}`),
  
  // Получить все детали в группе
  getDetails: (groupId) => api.get(`/group/${groupId}/details`),
};

// API для работы со статусами
export const statusAPI = {
  // Получить доступные статусы
  getChoices: () => api.get('/detail-status-choices'),
};

export default api;
