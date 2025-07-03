import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Stethoscope, Droplet, LogOut, User, Menu, X, Home, BookOpen, CalendarPlus, ShieldCheck, AlertTriangle } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const isAuthenticated = !!user;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isAdmin = user?.role === 'Admin';

    const navLinks = (
        <>
            <Link to="/" className="flex items-center text-gray-600 hover:text-red-500 transition-colors px-3 py-2 rounded-md text-sm font-medium">
                <Home className="w-4 h-4 mr-1.5" />Trang chủ
            </Link>
            <Link to="/blood-compatibility" className="flex items-center text-gray-600 hover:text-red-500 transition-colors px-3 py-2 rounded-md text-sm font-medium">
                <BookOpen className="w-4 h-4 mr-1.5" />Cẩm nang
            </Link>
            <Link to="/blood-requests" className="flex items-center text-gray-600 hover:text-red-500 transition-colors px-3 py-2 rounded-md text-sm font-medium">
                <AlertTriangle className="w-4 h-4 mr-1.5" />Cần máu gấp
            </Link>


            {isAuthenticated && (
                <Link to="/request-donation" className="flex items-center text-gray-600 hover:text-red-500 transition-colors px-3 py-2 rounded-md text-sm font-medium">
                    <CalendarPlus className="w-4 h-4 mr-1.5" />Đặt lịch hiến máu
                </Link>
            )}
            {isAdmin && (
                <Link to="/admin" className="flex items-center text-red-600 hover:text-red-700 transition-colors px-3 py-2 rounded-md text-sm font-bold">
                    <ShieldCheck className="w-4 h-4 mr-1.5" />Quản trị
                </Link>
            )}
        </>
    );

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center text-red-600">
                            <Droplet className="w-8 h-8" />
                            <span className="ml-2 text-xl font-bold">BloodConnect</span>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-1">{navLinks}</div>
                    </div>
                    <div className="hidden md:block">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/profile" className="flex items-center text-gray-600 hover:text-red-500 transition-colors">
                                    <User className="w-5 h-5 mr-1" />
                                    {/* SỬA Ở ĐÂY: Dùng user.fullName */}
                                    <span>{user.fullName || 'Hồ sơ'}</span>
                                </Link>
                                <button onClick={handleLogout} className="flex items-center bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors">
                                    <LogOut className="w-4 h-4 mr-1" />
                                    <span>Đăng xuất</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login" className="text-gray-600 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium">Đăng nhập</Link>
                                <Link to="/register" className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600">Đăng ký</Link>
                            </div>
                        )}
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-red-600 focus:outline-none">
                            <span className="sr-only">Mở menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">{navLinks}</div>
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        {isAuthenticated ? (
                            <div className="px-5">
                                <div className="flex items-center mb-3">
                                    <User className="w-5 h-5 mr-2 text-gray-500" />
                                    <div className="text-base font-medium text-gray-800">{user.fullName}</div>
                                </div>
                                <Link to="/profile" className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-red-600">Hồ sơ</Link>
                                <button onClick={handleLogout} className="block w-full text-left mt-1 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-red-600">Đăng xuất</button>
                            </div>
                        ) : (
                            <div className="px-2 space-y-1">
                                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-red-600">Đăng nhập</Link>
                                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-red-600">Đăng ký</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;