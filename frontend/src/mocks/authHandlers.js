import { http, HttpResponse } from 'msw';
import { API_URL } from '../config';

// Dữ liệu mock cho người dùng đang đăng nhập.
// Dùng 'let' để có thể cập nhật khi người dùng sửa profile.
let mockCurrentUser = {
    id: 100, // ID riêng cho user đang đăng nhập
    username: 'current.user',
    email: 'member@example.com',
    fullName: 'Current Mock User',
    phone: '0987654321',
    dateOfBirth: '1995-10-20',
    gender: 'Female',
    address: '456 User Street, Mock City',
    bloodTypeDescription: 'A+ (Mock)',
    medicalConditions: 'None',
    lastDonationDate: '2024-01-10',
    isReadyToDonate: true,
    role: 'Member',
    status: 'Active',
    emailVerified: true,
    phoneVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

export const authHandlers = [
    // Handler cho Đăng nhập
    http.post(`${API_URL}/auth/login`, async ({ request }) => {
        const { email, password } = await request.json();
        if (password !== 'password') {
            return HttpResponse.json({ message: "Invalid credentials (MSW)" }, { status: 401 });
        }

        let userToLogin = { ...mockCurrentUser };

        if (email.toLowerCase().includes('admin')) {
            userToLogin = {
                ...userToLogin,
                id: 1,
                email: 'admin@example.com',
                fullName: 'Mock Admin',
                role: 'Admin',
            };
        } else if (email.toLowerCase().includes('staff')) {
            userToLogin = {
                ...userToLogin,
                id: 2, // ID riêng cho user staff
                email: 'staff@example.com',
                fullName: 'Mock Staff User',
                role: 'Staff',
            };
        } else {
            userToLogin.email = email;
        }

        return HttpResponse.json({
            accessToken: `msw-jwt-token-for-${userToLogin.email}`,
            tokenType: "Bearer",
            userId: userToLogin.id,
            email: userToLogin.email,
            fullName: userToLogin.fullName,
            role: userToLogin.role,
        });
    }),

    // Handler cho Đăng ký
    http.post(`${API_URL}/auth/register`, async ({ request }) => {
        const reqBody = await request.json();
        console.log('MSW: User registration attempt:', reqBody);
        return HttpResponse.json(
            { message: "User registered successfully! (MSW)" },
            { status: 201 }
        );
    }),

    http.get(`${API_URL}/users/me/profile`, () => {
        return HttpResponse.json(mockCurrentUser);
    }),

    http.put(`${API_URL}/users/me/profile`, async ({ request }) => {
        const updatedData = await request.json();
        mockCurrentUser = { ...mockCurrentUser, ...updatedData };
        console.log('MSW: Updated current user profile:', mockCurrentUser);
        return HttpResponse.json(mockCurrentUser);
    }),
];



