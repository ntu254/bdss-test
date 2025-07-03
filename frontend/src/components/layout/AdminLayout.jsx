// frontendv2/src/components/layout/AdminLayout.jsx
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Droplets, GitCompareArrows, Home, LogOut, MessageSquareWarning, History, Warehouse } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth'; 

const AdminLayout = () => {
    const location = useLocation();
    const { logout, user } = useAuth();

    const menuItems = [
        { path: "/admin", icon: LayoutDashboard, label: "Dashboard", roles: ['Admin'] }, 
        { path: "/admin/users", icon: Users, label: "Quản lý người dùng", roles: ['Admin'] }, 
        { path: "/admin/blood-types", icon: Droplets, label: "Quản lý loại máu", roles: ['Admin'] }, 
        { path: "/admin/blood-compatibility", icon: GitCompareArrows, label: "Quản lý tương thích", roles: ['Admin'] }, 
        { path: "/admin/emergency-requests", icon: MessageSquareWarning, label: "Yêu cầu khẩn cấp", roles: ['Admin', 'Staff'] }, 
        { path: "/admin/donation-history", icon: History, label: "Lịch sử hiến máu", roles: ['Admin', 'Staff'] }, 
        { path: "/admin/blood-inventory", icon: Warehouse, label: "Quản lý kho máu", roles: ['Admin', 'Staff'] }, 
    ];

    const isActive = (path) => {
        if (path === "/admin") {
            return location.pathname === "/admin";
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col fixed h-full">
                <div className="flex items-center justify-center h-16 border-b border-gray-700">
                    <Link to="/admin" className="flex items-center space-x-2 text-white">
                        <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
                        <span className="text-lg font-semibold">Admin Panel</span>
                    </Link>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {menuItems.map((item) => {                    
                        if (user && item.roles.includes(user.role)) { 
                            return (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    className={`flex items-center px-2 py-2.5 text-sm font-medium rounded-md transition-colors ${isActive(item.path)
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                >
                                    <item.icon size={20} className="mr-3" />
                                    {item.label}
                                </Link>
                            );
                        }
                        return null;
                    })}
                </nav>
                <div className="px-2 py-4 border-t border-gray-700 space-y-1">
                    <Link
                        to="/"
                        className="w-full flex items-center px-2 py-2.5 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                        <Home size={20} className="mr-3" />
                        Về trang chủ
                    </Link>
                    <button
                        onClick={logout}
                        className="w-full flex items-center px-2 py-2.5 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                        <LogOut size={20} className="mr-3" />
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col ml-64">
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;