// src/services/bloodTypeService.js
import apiClient from './apiClient';

const bloodTypeService = {
    getAll: () => {
        return apiClient.get('/blood-types').then(res => res.data);
    },
    create: (data) => {
        return apiClient.post('/blood-types', data).then(res => res.data);
    },
    update: (id, data) => {
        const updateData = { description: data.description };
        return apiClient.put(`/blood-types/${id}`, updateData).then(res => res.data);
    },
    delete: (id) => {
        return apiClient.delete(`/blood-types/${id}`);
    },
};

export default bloodTypeService;