import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:8080';

const mockDonationHistory = [
    { id: 1, donationDate: '2024-10-25T10:00:00Z', location: 'Trung tâm hiến máu TP.HCM', status: 'COMPLETED' },
    { id: 2, donationDate: '2024-04-15T14:30:00Z', location: 'Bệnh viện Chợ Rẫy', status: 'COMPLETED' },
    { id: 3, donationDate: '2025-01-05T09:00:00Z', location: 'Điểm hiến máu lưu động Q1', status: 'CANCELLED' },
    { id: 4, donationDate: '2025-06-12T11:00:00Z', location: 'Trung tâm hiến máu TP.HCM', status: 'PENDING' },
];

export const donationHandlers = [
    http.get(`${API_URL}/api/donations/history`, () => {
        console.log('[MSW] Handled GET /api/donations/history');
        // Giả lập yêu cầu cần xác thực
        // Trong môi trường test thực tế, bạn sẽ kiểm tra header 'Authorization'
        return HttpResponse.json(mockDonationHistory);
    }),
];