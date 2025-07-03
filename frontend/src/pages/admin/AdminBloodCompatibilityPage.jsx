// src/pages/admin/AdminBloodCompatibilityPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, RefreshCw, Edit3, Trash2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import bloodCompatibilityService from '../../services/bloodCompatibilityService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import BloodCompatibilityFormModal from '../../components/admin/BloodCompatibilityFormModal';
import Pagination from '../../components/common/Pagination';
import { useAuth } from '../../hooks/useAuth'; // Import useAuth

const AdminBloodCompatibilityPage = () => {
    const [rulesPage, setRulesPage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState(null);
    const { user } = useAuth(); // Lấy user từ useAuth

    const fetchRules = useCallback(async (page = currentPage, size = pageSize) => {
        setIsLoading(true);
        try {
            const data = await bloodCompatibilityService.getAll(page, size);
            setRulesPage(data);
        } catch (error) {
            toast.error(`Lỗi khi tải quy tắc tương thích: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, pageSize]);

    useEffect(() => {
        fetchRules();
    }, [fetchRules]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleRefresh = () => {
        fetchRules(currentPage, pageSize);
    };

    const handleOpenModal = (rule = null) => {
        // Chỉ cho phép Admin mở modal để chỉnh sửa/tạo mới
        if (user?.role !== 'Admin' && rule) { //
            toast.error("Bạn không có quyền chỉnh sửa quy tắc tương thích.");
            return;
        }
        if (user?.role !== 'Admin' && !rule) { //
            toast.error("Bạn không có quyền thêm quy tắc tương thích.");
            return;
        }
        setEditingRule(rule);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRule(null);
    };

    const handleSaveSuccess = () => {
        fetchRules(currentPage, pageSize);
        handleCloseModal();
    };

    const handleDelete = async (id) => {
        // Chỉ cho phép Admin xóa
        if (user?.role !== 'Admin') { //
            toast.error("Bạn không có quyền xóa quy tắc tương thích.");
            return;
        }

        if (window.confirm(`Bạn có chắc chắn muốn xóa quy tắc tương thích (ID: ${id}) không?`)) {
            const toastId = toast.loading('Đang xóa...');
            try {
                await bloodCompatibilityService.delete(id);
                toast.success('Xóa thành công!', { id: toastId });
                if (rulesPage && rulesPage.content.length === 1 && currentPage > 0) {
                    setCurrentPage(currentPage - 1);
                } else {
                    fetchRules(currentPage, pageSize);
                }
            } catch (error) {
                toast.error(`Lỗi khi xóa: ${error.message}`, { id: toastId });
            }
        }
    };

    // Hàm helper để định dạng tên hiển thị
    const formatBloodTypeDisplay = (bloodType) => {
        if (!bloodType) return 'N/A';
        return `${bloodType.bloodGroup} (${bloodType.componentType})`;
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Tương thích máu</h1>
                <div className="flex items-center space-x-2">
                    <Button onClick={handleRefresh} variant="secondary" className="p-2" title="Làm mới" disabled={isLoading}>
                        <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                    </Button>
                    {user?.role === 'Admin' && ( // Chỉ Admin mới được thêm quy tắc
                        <Button onClick={() => handleOpenModal()} variant="primary" disabled={isLoading}>
                            <PlusCircle size={20} className="mr-2" /> Thêm quy tắc
                        </Button>
                    )}
                </div>
            </div>
            {isLoading && !rulesPage ? (
                <div className="flex justify-center items-center py-10"><LoadingSpinner size="12" /></div>
            ) : rulesPage && rulesPage.content && rulesPage.content.length > 0 ? (
                <>
                    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['ID', 'Loại máu cho', 'Loại máu nhận', 'Tương thích', 'Khẩn cấp', 'Điểm', 'Ghi chú', 'Hành động'].map(header => (
                                        <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {rulesPage.content.map((rule) => (
                                    <tr key={rule.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{rule.id}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{formatBloodTypeDisplay(rule.donorBloodType)}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{formatBloodTypeDisplay(rule.recipientBloodType)}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                                            {rule.isCompatible ? <CheckCircle className="text-green-500 mx-auto" size={20} /> : <XCircle className="text-red-500 mx-auto" size={20} />}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                                            {rule.isEmergencyCompatible ? <CheckCircle className="text-orange-500 mx-auto" size={20} /> : <XCircle className="text-gray-400 mx-auto" size={20} />}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{rule.compatibilityScore}</td>
                                        <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate" title={rule.notes}>{rule.notes || '-'}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            {user?.role === 'Admin' && ( // Chỉ Admin mới được chỉnh sửa/xóa quy tắc
                                                <>
                                                    <Button onClick={() => handleOpenModal(rule)} variant="icon" className="text-indigo-600 hover:text-indigo-800" title="Chỉnh sửa"><Edit3 size={18} /></Button>
                                                    <Button onClick={() => handleDelete(rule.id)} variant="icon" className="text-red-600 hover:text-red-800" title="Xóa"><Trash2 size={18} /></Button>
                                                </>
                                            )}
                                            {user?.role !== 'Admin' && ( // Hiện thị nút bị vô hiệu hóa cho các vai trò khác
                                                <>
                                                    <Button variant="icon" className="text-gray-400 cursor-not-allowed" title="Không có quyền chỉnh sửa"><Edit3 size={18} /></Button>
                                                    <Button variant="icon" className="text-gray-400 cursor-not-allowed" title="Không có quyền xóa"><Trash2 size={18} /></Button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {rulesPage.totalPages > 1 && (
                        <div className="mt-6 flex justify-between items-center">
                            <div className="text-sm text-gray-700">
                                Trang <span className="font-medium">{rulesPage.number + 1}</span> / <span className="font-medium">{rulesPage.totalPages}</span> ({rulesPage.totalElements} quy tắc)
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={rulesPage.totalPages}
                                onPageChange={handlePageChange}
                                isLoading={isLoading}
                            />
                        </div>
                    )}
                </>
            ) : (
                <p className="text-center text-gray-500 py-8">Chưa có quy tắc tương thích nào.</p>
            )}
            {isModalOpen && (
                <BloodCompatibilityFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSaveSuccess={handleSaveSuccess}
                    rule={editingRule}
                />
            )}
        </div>
    );
};

export default AdminBloodCompatibilityPage;