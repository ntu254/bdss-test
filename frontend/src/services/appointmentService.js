// src/services/appointmentService.js
import apiClient from './apiClient';

const appointmentService = {
    // Create appointment (Admin/Staff)
    createAppointment: (appointmentData) => {
        return apiClient.post('/appointments', appointmentData);
    },

    // Get all appointments (Admin/Staff)
    getAllAppointments: () => {
        return apiClient.get('/appointments');
    },

    // Get appointments by user
    getAppointmentsByUser: (userId) => {
        return apiClient.get(`/appointments/user/${userId}`);
    },

    // Request donation appointment (User)
    requestDonationAppointment: (appointmentData) => {
        return apiClient.post('/donations/request', appointmentData);
    },

    // Get my appointment history
    getMyAppointmentHistory: () => {
        return apiClient.get('/appointments/my-history');
    }
};

export default appointmentService;