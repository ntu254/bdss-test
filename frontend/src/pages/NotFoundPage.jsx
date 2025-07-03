// src/pages/NotFoundPage.jsx
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Navbar from '../components/layout/Navbar'; //
import Footer from '../components/layout/Footer'; //
import Button from '../components/common/Button';

const NotFoundPage = () => {
    const location = useLocation();

    useEffect(() => {
        // Ghi lại lỗi 404 vào console để debug nếu cần
        console.error(
            `404 Error: User attempted to access a non-existent route: ${location.pathname}${location.search}${location.hash}`
        );
    }, [location]);

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow flex flex-col items-center justify-center text-center px-4 pt-16 bg-gray-50">
                <AlertTriangle size={64} className="text-yellow-500 mb-6" />
                <h1 className="text-6xl font-bold text-gray-800 mb-3">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Oops! Trang không tồn tại.
                </h2>
                <p className="text-md text-gray-600 mb-8 max-w-md">
                    Có vẻ như trang bạn đang tìm kiếm đã bị di chuyển, xóa hoặc không bao giờ tồn tại.
                    Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
                </p>
                <div className="space-x-4">
                    <Link to="/">
                        <Button variant="primary">
                            Về trang chủ
                        </Button>
                    </Link>
                    <Button variant="secondary" onClick={() => window.history.back()}>
                        Quay lại trang trước
                    </Button>
                </div>
            </main>
        </div>
    );
};

export default NotFoundPage;