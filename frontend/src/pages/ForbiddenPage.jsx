// src/pages/ForbiddenPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Navbar from '../components/layout/Navbar'; //
import Footer from '../components/layout/Footer'; //
import Button from '../components/common/Button'; //

const ForbiddenPage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow flex flex-col items-center justify-center text-center px-4 pt-16">
                <ShieldAlert size={64} className="text-red-500 mb-6" />
                <h1 className="text-4xl font-bold text-gray-800 mb-3">403 - Truy cập bị từ chối</h1>
                <p className="text-lg text-gray-600 mb-8 max-w-md">
                    Rất tiếc, bạn không có quyền truy cập vào trang này.
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
            <Footer />
        </div>
    );
};

export default ForbiddenPage;