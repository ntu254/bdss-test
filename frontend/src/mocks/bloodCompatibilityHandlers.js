import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:8080';

// --- Dữ liệu giả lập (Mock Data) ---

// Dữ liệu giả cho các loại máu để sử dụng trong các quy tắc tương thích
const mockBloodTypes = [
    { id: 1, bloodGroup: 'O', rhFactor: '-', componentType: 'Whole Blood', description: 'O- (Máu toàn phần)' },
    { id: 2, bloodGroup: 'O', rhFactor: '+', componentType: 'Whole Blood', description: 'O+ (Máu toàn phần)' },
    { id: 3, bloodGroup: 'A', rhFactor: '-', componentType: 'Whole Blood', description: 'A- (Máu toàn phần)' },
    { id: 4, bloodGroup: 'A', rhFactor: '+', componentType: 'Whole Blood', description: 'A+ (Máu toàn phần)' },
    { id: 5, bloodGroup: 'B', rhFactor: '-', componentType: 'Whole Blood', description: 'B- (Máu toàn phần)' },
    { id: 6, bloodGroup: 'B', rhFactor: '+', componentType: 'Whole Blood', description: 'B+ (Máu toàn phần)' },
    { id: 7, bloodGroup: 'AB', rhFactor: '-', componentType: 'Whole Blood', description: 'AB- (Máu toàn phần)' },
    { id: 8, bloodGroup: 'AB', rhFactor: '+', componentType: 'Whole Blood', description: 'AB+ (Máu toàn phần)' },
    { id: 9, bloodGroup: 'A', rhFactor: '+', componentType: 'Plasma', description: 'A+ (Huyết tương)' },
    { id: 10, bloodGroup: 'O', rhFactor: '+', componentType: 'Red Blood Cells', description: 'O+ (Hồng cầu)' },
    { id: 11, bloodGroup: 'B', rhFactor: '-', componentType: 'Platelets', description: 'B- (Tiểu cầu)' },
];

// Dữ liệu giả cho các quy tắc tương thích máu
let mockCompatibilities = [
    { id: 1, donorBloodType: mockBloodTypes[0], recipientBloodType: mockBloodTypes[0], isCompatible: true },
    { id: 2, donorBloodType: mockBloodTypes[0], recipientBloodType: mockBloodTypes[1], isCompatible: true },
    { id: 3, donorBloodType: mockBloodTypes[0], recipientBloodType: mockBloodTypes[2], isCompatible: true },
    { id: 4, donorBloodType: mockBloodTypes[1], recipientBloodType: mockBloodTypes[3], isCompatible: true },
    { id: 5, donorBloodType: mockBloodTypes[2], recipientBloodType: mockBloodTypes[6], isCompatible: false },
    // Thêm các quy tắc khác nếu cần
];

// --- Handlers ---

export const bloodCompatibilityHandlers = [
    // HANDLER MỚI ĐƯỢC THÊM: Cung cấp dữ liệu cho dropdown các loại máu
    http.get(`${API_URL}/api/blood-types`, () => {
        console.log('[MSW] Handled GET /api/blood-types');
        return HttpResponse.json(mockBloodTypes);
    }),

    // 1. Handler để lấy TẤT CẢ quy tắc tương thích (có phân trang)
    http.get(`${API_URL}/api/blood-compatibility`, ({ request }) => {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '0', 10);
        const size = parseInt(url.searchParams.get('size') || '10', 10);

        const start = page * size;
        const end = start + size;
        const paginatedContent = mockCompatibilities.slice(start, end);

        console.log('[MSW] Handled GET /api/blood-compatibility', { page, size });

        return HttpResponse.json({
            content: paginatedContent,
            totalPages: Math.ceil(mockCompatibilities.length / size),
            totalElements: mockCompatibilities.length,
            number: page,
            size: size,
            first: page === 0,
            last: end >= mockCompatibilities.length,
            empty: paginatedContent.length === 0,
        });
    }),

    // 2. Handler để lấy MỘT quy tắc theo ID
    http.get(`${API_URL}/api/blood-compatibility/:id`, ({ params }) => {
        const { id } = params;
        const rule = mockCompatibilities.find(c => c.id === parseInt(id, 10));

        if (!rule) {
            return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
        }

        console.log(`[MSW] Handled GET /api/blood-compatibility/${id}`);
        return HttpResponse.json(rule);
    }),

    // 3. Handler để TẠO MỚI một quy tắc
    http.post(`${API_URL}/api/blood-compatibility`, async ({ request }) => {
        const newRuleData = await request.json();
        const donor = mockBloodTypes.find(bt => bt.id === newRuleData.donorId);
        const recipient = mockBloodTypes.find(bt => bt.id === newRuleData.recipientId);

        if (!donor || !recipient) {
            return new HttpResponse(JSON.stringify({ message: 'Donor or Recipient not found' }), { status: 400 });
        }

        const newId = mockCompatibilities.length > 0 ? Math.max(...mockCompatibilities.map(c => c.id)) + 1 : 1;
        const newRule = {
            id: newId,
            donorBloodType: donor,
            recipientBloodType: recipient,
            isCompatible: newRuleData.isCompatible,
        };
        mockCompatibilities.push(newRule);

        console.log('[MSW] Handled POST /api/blood-compatibility', newRule);
        return HttpResponse.json(newRule, { status: 201 });
    }),

    // 4. Handler để CẬP NHẬT một quy tắc
    http.put(`${API_URL}/api/blood-compatibility/:id`, async ({ params, request }) => {
        const { id } = params;
        const updates = await request.json();
        const ruleIndex = mockCompatibilities.findIndex(c => c.id === parseInt(id, 10));

        if (ruleIndex === -1) {
            return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
        }

        const updatedRule = { ...mockCompatibilities[ruleIndex], ...updates };
        // Giả lập cập nhật donor/recipient nếu có ID mới
        if (updates.donorId) {
            updatedRule.donorBloodType = mockBloodTypes.find(bt => bt.id === updates.donorId);
        }
        if (updates.recipientId) {
            updatedRule.recipientBloodType = mockBloodTypes.find(bt => bt.id === updates.recipientId);
        }

        mockCompatibilities[ruleIndex] = updatedRule;

        console.log(`[MSW] Handled PUT /api/blood-compatibility/${id}`, updatedRule);
        return HttpResponse.json(updatedRule);
    }),

    // 5. Handler để XÓA một quy tắc
    http.delete(`${API_URL}/api/blood-compatibility/:id`, ({ params }) => {
        const { id } = params;
        const initialLength = mockCompatibilities.length;
        mockCompatibilities = mockCompatibilities.filter(c => c.id !== parseInt(id, 10));

        if (mockCompatibilities.length === initialLength) {
            return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
        }

        console.log(`[MSW] Handled DELETE /api/blood-compatibility/${id}`);
        return new HttpResponse(null, { status: 204 });
    }),
];