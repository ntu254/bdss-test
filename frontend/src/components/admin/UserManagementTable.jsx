// src/components/admin/UserManagementTable.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Edit3, Trash2, Eye, CheckCircle, XCircle, ShieldQuestion, ArrowDownUp } from 'lucide-react';
import toast from 'react-hot-toast';
import userService from '../../services/userService';
import Button from '../common/Button';

const UserManagementTable = ({ users, onRefresh, onSort, renderSortIcon }) => {

    const handleDeleteUser = async (userId, userName, userRole) => {
        if (userRole === 'Admin') {
            toast.error("Không thể vô hiệu hóa tài khoản Admin.");
            return;
        }
        if (window.confirm(`Bạn có chắc chắn muốn vô hiệu hóa người dùng "${userName}" (ID: ${userId}) không? Hành động này sẽ chuyển trạng thái của họ thành "Suspended".`)) {
            const toastId = toast.loading(`Đang vô hiệu hóa người dùng ${userName}...`);
            try {
                await userService.softDeleteUserByAdmin(userId);
                toast.success(`Người dùng ${userName} đã được vô hiệu hóa.`, { id: toastId });
                if (onRefresh) onRefresh();
            } catch (error) {
                toast.error(`Lỗi khi vô hiệu hóa người dùng: ${error.message}`, { id: toastId });
            }
        }
    };

    const getRoleSpecificClasses = (roleName) => {
        switch (roleName) {
            case 'Admin':
                return 'bg-red-100 text-red-800';
            case 'Staff':
                return 'bg-yellow-100 text-yellow-800';
            case 'Member':
                return 'bg-green-100 text-green-800';
            case 'Guest':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusSpecificClasses = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Suspended':
                return 'bg-red-100 text-red-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Component cho header có thể sort
    const SortableHeader = ({ field, children }) => (
        <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
            onClick={() => onSort && onSort(field)}
        >
            <div className="flex items-center">
                {children}
                {renderSortIcon && renderSortIcon(field)}
            </div>
        </th>
    );

    if (!users || users.length === 0) {
        return <p className="text-center text-gray-500 py-8">Không có dữ liệu người dùng.</p>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <SortableHeader field="id">ID</SortableHeader>
                        <SortableHeader field="fullName">Họ tên</SortableHeader>
                        <SortableHeader field="email">Email</SortableHeader>
                        <SortableHeader field="role">Vai trò</SortableHeader>
                        <SortableHeader field="status">Trạng thái</SortableHeader>
                        <SortableHeader field="emailVerified">Email X.Thực</SortableHeader>
                        <SortableHeader field="createdAt">Ngày tạo</SortableHeader>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.fullName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleSpecificClasses(user.role)}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusSpecificClasses(user.status)}`}>
                                    {user.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                {user.emailVerified ? <CheckCircle size={18} className="text-green-500 inline" /> : <XCircle size={18} className="text-red-500 inline" />}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-1">
                                <Link to={`/admin/users/view/${user.id}`} title="Xem chi tiết">
                                    <Button variant="icon" className="text-blue-600 hover:text-blue-800">
                                        <Eye size={18} />
                                    </Button>
                                </Link>
                                <Link to={`/admin/users/edit/${user.id}`} title="Chỉnh sửa">
                                    <Button variant="icon" className="text-indigo-600 hover:text-indigo-800">
                                        <Edit3 size={18} />
                                    </Button>
                                </Link>
                                {user.role !== 'Admin' && user.status === 'Active' && (
                                    <Button
                                        onClick={() => handleDeleteUser(user.id, user.fullName, user.role)}
                                        variant="icon"
                                        className="text-red-600 hover:text-red-800"
                                        title="Vô hiệu hóa"
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                )}
                                {user.role === 'Admin' && (
                                    <Button
                                        variant="icon"
                                        className="text-gray-400 cursor-not-allowed"
                                        title="Không thể vô hiệu hóa Admin"
                                        disabled
                                    >
                                        <ShieldQuestion size={18} />
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagementTable;