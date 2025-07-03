// src/mocks/adminHandlers.js
import {http, HttpResponse} from 'msw';
import {API_URL} from '../config';

// --- DỮ LIỆU MOCK CÓ TRẠNG THÁI (STATEFUL) ---

let mockUsers = Array.from({length: 25}, (_, i) => {
    const id = i + 1;
    return {
        id: id,
        username: `user${id}`,
        email: `user${id}@mock.com`,
        fullName: `Mock User ${id}`,
        role: id === 1 ? 'Admin' : (id === 2 ? 'Staff' : (id % 5 === 0 ? 'Staff' : 'Member')), // Đảm bảo có user Staff cố định để test
        status: id % 4 === 0 ? 'Suspended' : (id % 3 === 0 ? 'Pending' : 'Active'),
        createdAt: new Date(Date.now() - (30 - id) * 1000 * 60 * 60 * 24).toISOString(),
        emailVerified: id % 2 === 0,
        phoneVerified: id % 3 === 0,
        // Thêm các trường profile khác để có dữ liệu đầy đủ hơn
        phone: id % 7 === 0 ? `09${10000000 + id}` : null,
        dateOfBirth: id % 10 === 0 ? `199${id % 9}-0${id % 12 + 1}-15` : null,
        gender: id % 2 === 0 ? 'Male' : (id % 3 === 0 ? 'Female' : null),
        address: id % 6 === 0 ? `${id} Mock Street, Mock City` : null,
        emergencyContact: id % 8 === 0 ? `09${90000000 + id}` : null,
        bloodType: null, // Sẽ điền sau nếu cần mock liên kết bloodType
        bloodTypeDescription: id % 3 === 0 ? 'A+ (Whole Blood)' : (id % 5 === 0 ? 'O- (Red Blood Cells)' : null),
        medicalConditions: id % 9 === 0 ? 'Diabetes' : null,
        lastDonationDate: id % 4 === 0 ? `2024-0${id % 12 + 1}-0${id % 28 + 1}` : null,
        isReadyToDonate: id % 2 === 0,
    };
});
let nextUserId = 26;

let mockBloodTypes = [
    {
        id: 1,
        bloodGroup: "A+",
        componentType: "Whole Blood",
        description: "A+ Máu toàn phần",
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        bloodGroup: "O-",
        componentType: "Red Blood Cells",
        description: "O- Hồng cầu",
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        bloodGroup: "B+",
        componentType: "Plasma",
        description: "B+ Huyết tương",
        createdAt: new Date().toISOString()
    },
    {
        id: 4,
        bloodGroup: "AB-",
        componentType: "Platelets",
        description: "AB- Tiểu cầu",
        createdAt: new Date().toISOString()
    },
    {
        id: 5,
        bloodGroup: "A-",
        componentType: "Whole Blood",
        description: "A- Máu toàn phần",
        createdAt: new Date().toISOString()
    },
];
let nextBloodTypeId = 6;

let mockCompatibilityRules = [
    // Ví dụ rule: O- có thể cho O-, nhận từ O-
    {
        id: 1,
        donorBloodType: mockBloodTypes[1],
        recipientBloodType: mockBloodTypes[1],
        isCompatible: true,
        isEmergencyCompatible: true,
        compatibilityScore: 100,
        notes: "O- to O- (Self-compatible)",
        createdAt: new Date().toISOString()
    },
    // Ví dụ rule: A+ có thể nhận từ A+, A-, O+, O-
    {
        id: 2,
        donorBloodType: mockBloodTypes[0],
        recipientBloodType: mockBloodTypes[0],
        isCompatible: true,
        isEmergencyCompatible: true,
        compatibilityScore: 100,
        notes: "A+ to A+ (Self-compatible)",
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        donorBloodType: mockBloodTypes[4],
        recipientBloodType: mockBloodTypes[0],
        isCompatible: true,
        isEmergencyCompatible: false,
        compatibilityScore: 80,
        notes: "A- to A+ (Normal compatible)",
        createdAt: new Date().toISOString()
    },
    {
        id: 4,
        donorBloodType: mockBloodTypes[1],
        recipientBloodType: mockBloodTypes[0],
        isCompatible: true,
        isEmergencyCompatible: false,
        compatibilityScore: 75,
        notes: "O- to A+ (Universal donor for RBC)",
        createdAt: new Date().toISOString()
    },
    {
        id: 5,
        donorBloodType: mockBloodTypes[1],
        recipientBloodType: mockBloodTypes[0],
        isCompatible: true,
        isEmergencyCompatible: true,
        compatibilityScore: 90,
        notes: "O- to A+ (Emergency compatible for RBC)",
        createdAt: new Date().toISOString()
    },
    // A+ không cho O-
    {
        id: 6,
        donorBloodType: mockBloodTypes[0],
        recipientBloodType: mockBloodTypes[1],
        isCompatible: false,
        isEmergencyCompatible: false,
        compatibilityScore: 0,
        notes: "A+ cannot donate to O-",
        createdAt: new Date().toISOString()
    },
];
let nextCompatibilityRuleId = 7;

const mockRoles = [
    {id: 1, name: "Guest", description: "Public users..."},
    {id: 2, name: "Member", description: "Registered users..."},
    {id: 3, name: "Staff", description: "Medical staff..."},
    {id: 4, name: "Admin", description: "System admins..."},
];

let mockDonationRequests = Array.from({length: 15}, (_, i) => ({
    id: i + 1,
    donorId: mockUsers[i]?.id || 1, // Gắn với mockUser
    donorName: mockUsers[i]?.fullName || `Mock Donor ${i + 1}`,
    bloodTypeId: mockBloodTypes[i % mockBloodTypes.length].id,
    bloodTypeDescription: mockBloodTypes[i % mockBloodTypes.length].description,
    requestDate: new Date(Date.now() - (15 - i) * 1000 * 60 * 60 * 24).toISOString().split('T')[0],
    preferredDate: new Date(Date.now() + i * 1000 * 60 * 60 * 24).toISOString().split('T')[0],
    status: ['Pending', 'Approved', 'Completed', 'Rejected'][i % 4],
    notes: `Yêu cầu hiến máu số ${i + 1}`,
}));
let nextDonationRequestId = 16;

let mockBloodInventory = [
    {id: 1, bloodTypeId: mockBloodTypes[0].id, quantityMl: 10000, lastUpdated: new Date().toISOString()},
    {id: 2, bloodTypeId: mockBloodTypes[1].id, quantityMl: 8000, lastUpdated: new Date().toISOString()},
    {id: 3, bloodTypeId: mockBloodTypes[2].id, quantityMl: 5000, lastUpdated: new Date().toISOString()},
];
let nextBloodInventoryId = 4;


// --- MẢNG HANDLERS ĐỂ EXPORT ---

export const adminHandlers = [
    // == USER MANAGEMENT ==
    http.get(`${API_URL}/admin/users`, ({request}) => {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page')) || 0;
        const size = parseInt(url.searchParams.get('size')) || 10;
        const search = url.searchParams.get('search')?.toLowerCase() || '';
        const role = url.searchParams.get('role') || '';
        const status = url.searchParams.get('status') || '';
        const sortParam = url.searchParams.get('sort') || 'id,asc';
        const [sortBy, sortDirection] = sortParam.split(',');


        const filteredUsers = mockUsers.filter(user => {
            const matchesSearch = !search ||
                user.id.toString().includes(search) ||
                user.fullName.toLowerCase().includes(search) ||
                user.email.toLowerCase().includes(search) ||
                user.username.toLowerCase().includes(search);
            const matchesRole = !role || user.role === role;
            const matchesStatus = !status || user.status === status;
            return matchesSearch && matchesRole && matchesStatus;
        });

        // Sắp xếp dữ liệu
        filteredUsers.sort((a, b) => {
            let valA = a[sortBy];
            let valB = b[sortBy];

            // Xử lý sắp xếp theo ID dạng số
            if (sortBy === 'id') {
                valA = parseInt(valA);
                valB = parseInt(valB);
            }
            // Xử lý sắp xếp theo ngày nếu cần
            if (sortBy.includes('Date') || sortBy.includes('At')) {
                valA = new Date(valA);
                valB = new Date(valB);
            }

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        const totalElements = filteredUsers.length;
        const totalPages = Math.ceil(totalElements / size);
        const content = filteredUsers.slice(page * size, (page + 1) * size);

        return HttpResponse.json({
            content,
            totalElements,
            totalPages,
            number: page,
            size,
            first: page === 0,
            last: page >= totalPages - 1
        });
    }),

    http.get(`${API_URL}/admin/users/:userId`, ({params}) => {
        const user = mockUsers.find(u => u.id === parseInt(params.userId));
        if (!user) return HttpResponse.json({message: 'User not found'}, {status: 404});
        // Trả về thông tin đầy đủ, bao gồm bloodTypeDescription
        return HttpResponse.json(user);
    }),

    http.post(`${API_URL}/admin/users`, async ({request}) => {
        const newUserReq = await request.json();
        // Kiểm tra trùng email/username
        if (mockUsers.some(u => u.email === newUserReq.email)) {
            return HttpResponse.json({email: 'Email đã tồn tại.'}, {status: 409});
        }
        if (mockUsers.some(u => u.username === newUserReq.username)) {
            return HttpResponse.json({username: 'Tên đăng nhập đã tồn tại.'}, {status: 409});
        }
        // Gán bloodTypeDescription nếu có bloodTypeId
        let bloodTypeDescription = null;
        if (newUserReq.bloodTypeId) {
            const bt = mockBloodTypes.find(b => b.id === newUserReq.bloodTypeId);
            if (bt) bloodTypeDescription = `${bt.bloodGroup} (${bt.componentType})`;
        }

        const newUser = {
            id: nextUserId++,
            ...newUserReq,
            bloodTypeDescription, // Thêm bloodTypeDescription vào user object
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: newUserReq.status || 'Active',
            role: newUserReq.roleName || 'Member', // Đảm bảo role được set đúng
            emailVerified: newUserReq.emailVerified || false,
            phoneVerified: newUserReq.phoneVerified || false,
        };
        mockUsers.unshift(newUser); // Thêm vào đầu mảng
        return HttpResponse.json(newUser, {status: 201});
    }),

    http.put(`${API_URL}/admin/users/:userId`, async ({request, params}) => {
        const updatedData = await request.json();
        const userIndex = mockUsers.findIndex(u => u.id === parseInt(params.userId));
        if (userIndex === -1) return HttpResponse.json({message: 'User not found'}, {status: 404});

        // Kiểm tra trùng email/username nếu có thay đổi và trùng với user khác
        if (updatedData.email && mockUsers.some((u, idx) => idx !== userIndex && u.email === updatedData.email)) {
            return HttpResponse.json({email: 'Email đã tồn tại.'}, {status: 409});
        }
        if (updatedData.username && mockUsers.some((u, idx) => idx !== userIndex && u.username === updatedData.username)) {
            return HttpResponse.json({username: 'Tên đăng nhập đã tồn tại.'}, {status: 409});
        }

        // Cập nhật bloodTypeDescription nếu bloodTypeId được gửi lên
        let bloodTypeDescription = mockUsers[userIndex].bloodTypeDescription;
        if (updatedData.bloodTypeId !== undefined && updatedData.bloodTypeId !== null) {
            const bt = mockBloodTypes.find(b => b.id === updatedData.bloodTypeId);
            if (bt) {
                bloodTypeDescription = `${bt.bloodGroup} (${bt.componentType})`;
            } else {
                bloodTypeDescription = null; // Nếu bloodTypeId không hợp lệ hoặc null
            }
        } else if (updatedData.bloodTypeId === null) {
            bloodTypeDescription = null;
        }


        mockUsers[userIndex] = {
            ...mockUsers[userIndex],
            ...updatedData,
            bloodTypeDescription, // Cập nhật bloodTypeDescription
            role: updatedData.roleName || mockUsers[userIndex].role, // Cập nhật roleName thành role
            updatedAt: new Date().toISOString(),
        };
        return HttpResponse.json(mockUsers[userIndex]);
    }),

    http.delete(`${API_URL}/admin/users/:userId`, ({params}) => {
        const userIndex = mockUsers.findIndex(u => u.id === parseInt(params.userId));
        if (userIndex === -1) return HttpResponse.json({message: 'User not found'}, {status: 404});
        mockUsers[userIndex].status = 'Suspended';
        mockUsers[userIndex].updatedAt = new Date().toISOString();
        return HttpResponse.json(mockUsers[userIndex]);
    }),

    // == BLOOD TYPE MANAGEMENT ==
    http.get(`${API_URL}/blood-types`, ({request}) => {
        const url = new URL(request.url);
        const search = url.searchParams.get('search')?.toLowerCase() || '';
        const bloodGroup = url.searchParams.get('bloodGroup') || '';
        const componentType = url.searchParams.get('componentType') || '';

        const filtered = mockBloodTypes.filter(bt => {
            const matchesSearch = !search ||
                bt.id.toString().includes(search) ||
                bt.bloodGroup.toLowerCase().includes(search) ||
                bt.componentType.toLowerCase().includes(search) ||
                (bt.description && bt.description.toLowerCase().includes(search));
            const matchesGroup = !bloodGroup || bt.bloodGroup === bloodGroup;
            const matchesComponent = !componentType || bt.componentType === componentType;
            return matchesSearch && matchesGroup && matchesComponent;
        });
        return HttpResponse.json(filtered);
    }),

    http.post(`${API_URL}/blood-types`, async ({request}) => {
        const newTypeReq = await request.json();
        // Kiểm tra trùng lặp
        if (mockBloodTypes.some(bt => bt.bloodGroup === newTypeReq.bloodGroup && bt.componentType === newTypeReq.componentType)) {
            return HttpResponse.json({message: 'Loại máu và thành phần này đã tồn tại.'}, {status: 409});
        }
        const newType = {
            id: nextBloodTypeId++, ...newTypeReq,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        mockBloodTypes.unshift(newType);
        return HttpResponse.json(newType, {status: 201});
    }),

    http.put(`${API_URL}/blood-types/:id`, async ({request, params}) => {
        const updatedData = await request.json();
        const typeIndex = mockBloodTypes.findIndex(bt => bt.id === parseInt(params.id));
        if (typeIndex === -1) return HttpResponse.json({message: 'Blood type not found'}, {status: 404});

        // Backend hiện tại chỉ cho phép update description
        // Giả lập logic update:
        mockBloodTypes[typeIndex] = {
            ...mockBloodTypes[typeIndex],
            description: updatedData.description !== undefined ? updatedData.description : mockBloodTypes[typeIndex].description,
            updatedAt: new Date().toISOString(),
        };
        return HttpResponse.json(mockBloodTypes[typeIndex]);
    }),

    http.delete(`${API_URL}/blood-types/:id`, ({params}) => {
        const idToDelete = parseInt(params.id);
        const initialLength = mockBloodTypes.length;
        mockBloodTypes = mockBloodTypes.filter(bt => bt.id !== idToDelete);
        // Đồng thời xóa các rule tương thích liên quan
        mockCompatibilityRules = mockCompatibilityRules.filter(r => r.donorBloodType.id !== idToDelete && r.recipientBloodType.id !== idToDelete);

        if (mockBloodTypes.length < initialLength) return new HttpResponse(null, {status: 204});
        return HttpResponse.json({message: "Not found"}, {status: 404});
    }),

    // == BLOOD COMPATIBILITY MANAGEMENT ==
    http.get(`${API_URL}/blood-compatibility`, ({request}) => {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page')) || 0;
        const size = parseInt(url.searchParams.get('size')) || 10;
        const search = url.searchParams.get('search')?.toLowerCase() || '';
        const isCompatibleParam = url.searchParams.get('isCompatible');
        const isEmergencyParam = url.searchParams.get('isEmergencyCompatible');

        const filtered = mockCompatibilityRules.filter(rule => {
            const matchesSearch = !search || rule.id.toString().includes(search) || (rule.notes && rule.notes.toLowerCase().includes(search));
            const matchesCompatible = isCompatibleParam === null || isCompatibleParam === '' || rule.isCompatible === (isCompatibleParam === 'true');
            const matchesEmergency = isEmergencyParam === null || isEmergencyParam === '' || rule.isEmergencyCompatible === (isEmergencyParam === 'true');
            return matchesSearch && matchesCompatible && matchesEmergency;
        });

        const totalElements = filtered.length;
        const totalPages = Math.ceil(totalElements / size);
        const content = filtered.slice(page * size, (page + 1) * size);
        return HttpResponse.json({
            content,
            totalElements,
            totalPages,
            number: page,
            size,
            first: page === 0,
            last: page >= totalPages - 1
        });
    }),

    http.post(`${API_URL}/blood-compatibility`, async ({request}) => {
        const data = await request.json();
        const donorBloodType = mockBloodTypes.find(bt => bt.id === data.donorBloodTypeId);
        const recipientBloodType = mockBloodTypes.find(bt => bt.id === data.recipientBloodTypeId);
        if (!donorBloodType || !recipientBloodType) return HttpResponse.json({message: "Invalid blood type ID"}, {status: 400});

        // Kiểm tra trùng lặp quy tắc
        const exists = mockCompatibilityRules.some(rule =>
            rule.donorBloodType.id === data.donorBloodTypeId &&
            rule.recipientBloodType.id === data.recipientBloodTypeId
        );
        if (exists) {
            return HttpResponse.json({message: "Quy tắc tương thích này đã tồn tại."}, {status: 409});
        }

        const newRule = {
            ...data,
            id: nextCompatibilityRuleId++,
            donorBloodType,
            recipientBloodType,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        mockCompatibilityRules.unshift(newRule);
        return HttpResponse.json(newRule, {status: 201});
    }),

    http.put(`${API_URL}/blood-compatibility/:id`, async ({request, params}) => {
        const data = await request.json();
        const ruleIndex = mockCompatibilityRules.findIndex(r => r.id === parseInt(params.id));
        if (ruleIndex === -1) return HttpResponse.json({message: 'Rule not found'}, {status: 404});

        const donorBloodType = mockBloodTypes.find(bt => bt.id === data.donorBloodTypeId);
        const recipientBloodType = mockBloodTypes.find(bt => bt.id === data.recipientBloodTypeId);
        if (!donorBloodType || !recipientBloodType) return HttpResponse.json({message: "Invalid blood type ID"}, {status: 400});

        // Kiểm tra trùng lặp với quy tắc khác (trừ chính nó)
        const exists = mockCompatibilityRules.some((rule, idx) =>
            idx !== ruleIndex &&
            rule.donorBloodType.id === data.donorBloodTypeId &&
            rule.recipientBloodType.id === data.recipientBloodTypeId
        );
        if (exists) {
            return HttpResponse.json({message: "Quy tắc tương thích này đã tồn tại cho cặp loại máu khác."}, {status: 409});
        }

        mockCompatibilityRules[ruleIndex] = {
            ...mockCompatibilityRules[ruleIndex], ...data,
            donorBloodType,
            recipientBloodType,
            updatedAt: new Date().toISOString()
        };
        return HttpResponse.json(mockCompatibilityRules[ruleIndex]);
    }),

    http.delete(`${API_URL}/blood-compatibility/:id`, ({params}) => {
        const initialLength = mockCompatibilityRules.length;
        mockCompatibilityRules = mockCompatibilityRules.filter(r => r.id !== parseInt(params.id));
        if (mockCompatibilityRules.length < initialLength) return new HttpResponse(null, {status: 204});
        return HttpResponse.json({message: "Not found"}, {status: 404});
    }),

    // == COMMON DATA ==
    http.get(`${API_URL}/roles`, () => {
        return HttpResponse.json(mockRoles);
    }),

    // == DONATION REQUESTS (NEW) ==
    http.get(`${API_URL}/donation-requests`, ({request}) => {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page')) || 0;
        const size = parseInt(url.searchParams.get('size')) || 10;
        const search = url.searchParams.get('search')?.toLowerCase() || '';
        const status = url.searchParams.get('status')?.toLowerCase() || '';

        const filteredRequests = mockDonationRequests.filter(req => {
            const matchesSearch = !search ||
                req.id.toString().includes(search) ||
                req.donorName.toLowerCase().includes(search) ||
                req.bloodTypeDescription.toLowerCase().includes(search) ||
                (req.notes && req.notes.toLowerCase().includes(search));
            const matchesStatus = !status || req.status.toLowerCase() === status;
            return matchesSearch && matchesStatus;
        });

        filteredRequests.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());

        const totalElements = filteredRequests.length;
        const totalPages = Math.ceil(totalElements / size);
        const content = filteredRequests.slice(page * size, (page + 1) * size);

        return HttpResponse.json({
            content,
            totalElements,
            totalPages,
            number: page,
            size,
            first: page === 0,
            last: page >= totalPages - 1
        });
    }),

    http.get(`${API_URL}/donation-requests/:id`, ({params}) => {
        const request = mockDonationRequests.find(req => req.id === parseInt(params.id));
        if (!request) return HttpResponse.json({message: 'Donation request not found'}, {status: 404});
        return HttpResponse.json(request);
    }),

    http.post(`${API_URL}/donation-requests`, async ({request}) => {
        const newReq = await request.json();
        const donor = mockUsers.find(u => u.id === newReq.donorId);
        const bloodType = mockBloodTypes.find(bt => bt.id === newReq.bloodTypeId);
        if (!donor || !bloodType) return HttpResponse.json({message: 'Invalid donor or blood type ID'}, {status: 400});

        const newDonationRequest = {
            id: nextDonationRequestId++,
            donorId: donor.id,
            donorName: donor.fullName,
            bloodTypeId: bloodType.id,
            bloodTypeDescription: bloodType.description,
            requestDate: new Date().toISOString().split('T')[0],
            status: 'Pending',
            ...newReq,
        };
        mockDonationRequests.unshift(newDonationRequest);
        return HttpResponse.json(newDonationRequest, {status: 201});
    }),

    http.put(`${API_URL}/donation-requests/:id`, async ({request, params}) => {
        const updatedData = await request.json();
        const reqIndex = mockDonationRequests.findIndex(req => req.id === parseInt(params.id));
        if (reqIndex === -1) return HttpResponse.json({message: 'Donation request not found'}, {status: 404});

        // Update blood type description if bloodTypeId is changed
        let bloodTypeDescription = mockDonationRequests[reqIndex].bloodTypeDescription;
        if (updatedData.bloodTypeId !== undefined && updatedData.bloodTypeId !== null) {
            const bt = mockBloodTypes.find(b => b.id === updatedData.bloodTypeId);
            if (bt) bloodTypeDescription = `${bt.bloodGroup} (${bt.componentType})`;
        } else if (updatedData.bloodTypeId === null) {
            bloodTypeDescription = null;
        }

        mockDonationRequests[reqIndex] = {
            ...mockDonationRequests[reqIndex],
            ...updatedData,
            bloodTypeDescription,
            updatedAt: new Date().toISOString(),
        };
        return HttpResponse.json(mockDonationRequests[reqIndex]);
    }),

    // == BLOOD INVENTORY (NEW) ==
    http.get(`${API_URL}/blood-inventory`, ({request}) => {
        // Có thể thêm filter, pagination sau này
        const inventoryWithDetails = mockBloodInventory.map(item => {
            const bloodType = mockBloodTypes.find(bt => bt.id === item.bloodTypeId);
            return {
                ...item,
                bloodTypeDetails: bloodType ? {
                    bloodGroup: bloodType.bloodGroup,
                    componentType: bloodType.componentType,
                    description: bloodType.description
                } : null
            };
        });
        return HttpResponse.json(inventoryWithDetails);
    }),

    http.post(`${API_URL}/blood-inventory`, async ({request}) => {
        const newItem = await request.json();
        const bloodType = mockBloodTypes.find(bt => bt.id === newItem.bloodTypeId);
        if (!bloodType) return HttpResponse.json({message: 'Blood type not found'}, {status: 400});

        // Check if inventory for this blood type already exists
        const existingInventory = mockBloodInventory.find(item => item.bloodTypeId === newItem.bloodTypeId);
        if (existingInventory) {
            return HttpResponse.json({message: 'Tồn kho cho loại máu này đã tồn tại, vui lòng cập nhật.'}, {status: 409});
        }

        const newInventoryItem = {
            id: nextBloodInventoryId++,
            ...newItem,
            lastUpdated: new Date().toISOString(),
        };
        mockBloodInventory.push(newInventoryItem);
        return HttpResponse.json(newInventoryItem, {status: 201});
    }),

    http.put(`${API_URL}/blood-inventory/:id`, async ({request, params}) => {
        const updatedData = await request.json();
        const itemIndex = mockBloodInventory.findIndex(item => item.id === parseInt(params.id));
        if (itemIndex === -1) return HttpResponse.json({message: 'Inventory item not found'}, {status: 404});

        // Ensure bloodTypeId is valid if it's changed (or provided for consistency)
        if (updatedData.bloodTypeId) {
            const bloodType = mockBloodTypes.find(bt => bt.id === updatedData.bloodTypeId);
            if (!bloodType) return HttpResponse.json({message: 'Blood type not found for update'}, {status: 400});
        }

        mockBloodInventory[itemIndex] = {
            ...mockBloodInventory[itemIndex],
            ...updatedData,
            lastUpdated: new Date().toISOString(),
        };
        return HttpResponse.json(mockBloodInventory[itemIndex]);
    }),

    // == EMERGENCY REQUESTS (NEW) ==
    http.post(`${API_URL}/emergency-requests`, async ({request}) => {
        const newEmergencyReq = await request.json();
        // Giả lập xử lý yêu cầu khẩn cấp
        console.log('MSW: New emergency request received:', newEmergencyReq);
        return HttpResponse.json(
            {message: "Emergency request submitted successfully! (MSW)", id: 1},
            {status: 201}
        );
    }),
];