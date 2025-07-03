// src/services/bloodCompatibilityService.js
import apiClient from './apiClient';

const bloodCompatibilityService = {
    getAll: (page = 0, size = 10) => {
        return apiClient.get('/blood-compatibility', { params: { page, size, sort: 'id,asc' } }).then(res => res.data);
    },
    create: (data) => {
        return apiClient.post('/blood-compatibility', data).then(res => res.data);
    },
    update: (id, data) => {
        return apiClient.put(`/blood-compatibility/${id}`, data).then(res => res.data);
    },
    delete: (id) => {
        return apiClient.delete(`/blood-compatibility/${id}`);
    },
};

export default bloodCompatibilityService;