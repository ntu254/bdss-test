// src/pages/admin/AdminUserListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, RefreshCw, ArrowDownUp } from 'lucide-react';
import toast from 'react-hot-toast';

import userService from '../../services/userService';
import UserManagementTable from '../../components/admin/UserManagementTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import { useAuth } from '../../hooks/useAuth'; // Import useAuth hook

const AdminUserListPage = () => {
    const [usersPage, setUsersPage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [sort, setSort] = useState(['id', 'asc']);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth(); // Lấy user từ useAuth hook


    const fetchUsers = useCallback(async (page, size, currentSort, search) => {
        setIsLoading(true);
        try {
            const data = await userService.getAllUsers(page, size, currentSort, search);
            setUsersPage(data);
        } catch (error) {
            toast.error(`Lỗi khi tải danh sách người dùng: ${error.message}`);
            setUsersPage(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers(currentPage, pageSize, sort, searchTerm);
    }, [currentPage, pageSize, sort, searchTerm, fetchUsers]);

    const handleRefresh = () => {
        setCurrentPage(0);
        setSearchTerm('');
        setSort(['id', 'asc']); // Reset sort khi refresh
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(0); // Reset về trang đầu khi tìm kiếm
    };

    const handleSort = (field) => {
        const newDirection = sort[0] === field && sort[1] === 'asc' ? 'desc' : 'asc';
        setSort([field, newDirection]);
        setCurrentPage(0); // Reset về trang đầu khi sắp xếp
    };

    const renderSortIcon = (field) => {
        if (sort[0] === field) {
            return sort[1] === 'asc' ? <ArrowDownUp size={14} className="ml-1 rotate-180" /> : <ArrowDownUp size={14} className="ml-1" />;
        }
        return <ArrowDownUp size={14} className="ml-1 text-gray-300 group-hover:text-gray-400" />;
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Người dùng</h1>
                <div className="flex items-center space-x-2">
                    <Button onClick={handleRefresh} variant="secondary" className="p-2" title="Làm mới" disabled={isLoading}>
                        <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                    </Button>
                    {user?.role === 'Admin' && ( // Chỉ Admin mới được thêm người dùng
                        <Link to="/admin/users/new">
                            <Button variant="primary" disabled={isLoading}>
                                <PlusCircle size={20} className="mr-2" /> Thêm người dùng
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="mb-4">
                <SearchBar onSearch={handleSearch} placeholder="Tìm kiếm theo ID, họ tên hoặc email..." />
            </div>

            {isLoading && !usersPage ? (
                <div className="flex justify-center items-center py-10"><LoadingSpinner size="12" /></div>
            ) : usersPage && usersPage.content ? (
                <>
                    <UserManagementTable
                        users={usersPage.content}
                        onRefresh={handleRefresh}
                        onSort={handleSort}
                        currentSortField={sort[0]}
                        currentSortDirection={sort[1]}
                        renderSortIcon={renderSortIcon}
                    />
                    {usersPage.totalPages > 1 && (
                        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="text-sm text-gray-700">
                                Trang <span className="font-medium">{usersPage.number + 1}</span> / <span className="font-medium">{usersPage.totalPages}</span> ({usersPage.totalElements} kết quả)
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={usersPage.totalPages}
                                onPageChange={handlePageChange}
                                isLoading={isLoading}
                            />
                        </div>
                    )}
                </>
            ) : (
                <p className="text-center text-gray-500 py-8">Không có người dùng nào phù hợp.</p>
            )}
        </div>
    );
};

export default AdminUserListPage;