// src/pages/admin/AdminDashboardPage.jsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth'; //

const AdminDashboardPage = () => {
    const { user } = useAuth(); //

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-lg text-gray-700">
                    Chào mừng trở lại, <span className="font-semibold">{user?.fullName || user?.email}</span>!
                </p>
                <p className="mt-2 text-gray-600">
                    Đây là trang quản trị của Hệ thống Hỗ trợ Hiến Máu. Bạn có thể quản lý người dùng, các thành phần máu, và các thông tin khác từ thanh điều hướng bên trái.
                </p>
                {/* Thêm các widgets, biểu đồ, hoặc thông tin tóm tắt ở đây */}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Example Stats Cards */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Người dùng</h2>
                    <p className="text-3xl font-bold text-red-600">1,234</p> {/* Thay bằng dữ liệu thật */}
                    <p className="text-sm text-gray-500 mt-1">Tổng số người dùng đã đăng ký</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Lượt hiến máu</h2>
                    <p className="text-3xl font-bold text-red-600">567</p> {/* Thay bằng dữ liệu thật */}
                    <p className="text-sm text-gray-500 mt-1">Trong tháng này</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Yêu cầu máu</h2>
                    <p className="text-3xl font-bold text-red-600">89</p> {/* Thay bằng dữ liệu thật */}
                    <p className="text-sm text-gray-500 mt-1">Đang chờ xử lý</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;