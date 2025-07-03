// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn as LogInIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const { login, user, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    useEffect(() => {
        if (isAuthenticated) {
            const userRole = user?.role;
            toast.success(`Đăng nhập thành công! Chào mừng ${user?.fullName || 'bạn'}.`);
            if (userRole === 'Admin') {
                navigate('/admin', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate, from]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!credentials.email || !credentials.password) {
            toast.error("Vui lòng nhập đầy đủ email và mật khẩu.");
            return;
        }
        try {
            await login(credentials);
        } catch (err) {
            // `err.message` đã được chuẩn hóa ở service
            toast.error(err.message);
        }
    };

    return (
        <div className="max-h-screen bg-gray-50 flex flex-col justify-center">
            <main className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <LogInIcon className="mx-auto h-12 w-auto text-red-600" />
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Đăng nhập tài khoản
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Hoặc{' '}
                            <Link to="/register" className="font-medium text-red-600 hover:text-red-500">
                                tạo tài khoản mới
                            </Link>
                        </p>
                    </div>

                    <div className="bg-white py-8 px-6 shadow-xl rounded-xl sm:px-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <InputField
                                label="Địa chỉ Email"
                                id="email"
                                name="email"
                                type="email"
                                value={credentials.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                                disabled={authLoading}
                            />
                            <InputField
                                label="Mật khẩu"
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                disabled={authLoading}
                                hasIcon={true}
                                icon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                onIconClick={() => setShowPassword(!showPassword)}
                            />
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={authLoading}
                                isLoading={authLoading}
                                variant="primary"
                                size="lg"
                            >
                                Đăng nhập
                            </Button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;