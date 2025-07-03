// src/services/bloodRequestService.js
import apiClient from './apiClient';

const bloodRequestService = {
    // Create blood request (Staff/Admin)
    createBloodRequest: (requestData) => {
        return apiClient.post('/blood-requests', requestData);
    },

    // Search active requests by location
    searchActiveRequests: (locationData) => {
        return apiClient.post('/blood-requests/search', locationData);
    },

    // Get request by ID
    getRequestById: (id) => {
        return apiClient.get(`/blood-requests/${id}`);
    },

    // Cancel request
    cancelRequest: (id) => {
        return apiClient.put(`/blood-requests/${id}/cancel`);
    },

    // Update request status (Admin/Staff)
    updateRequestStatus: (id, status) => {
        return apiClient.put(`/blood-requests/${id}/status`, { status });
    },

    // Get all public blood requests
    getAllPublicBloodRequests: () => {
        return apiClient.get('/blood-requests/public');
    }
};

export default bloodRequestService;