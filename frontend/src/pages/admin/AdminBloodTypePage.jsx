import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PlusCircle, RefreshCw, Edit3, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import bloodTypeService from '../../services/bloodTypeService.js';
import Button from '../../components/common/Button.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import BloodTypeFormModal from '../../components/admin/BloodTypeFormModal.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import { useAuth } from '../../hooks/useAuth';

const AdminBloodTypePage = () => {
    // --- STATE MANAGEMENT ---
    const [bloodTypes, setBloodTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBloodType, setEditingBloodType] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();

    // THÊM MỚI: State để quản lý tab nào đang hoạt động
    const [activeTab, setActiveTab] = useState(null);

    // --- DATA FETCHING & PROCESSING ---
    const fetchBloodTypes = useCallback(async (search) => {
        setIsLoading(true);
        try {
            const data = await bloodTypeService.getAll(search);
            setBloodTypes(data || []);
        } catch (error) {
            toast.error(`Lỗi khi tải danh sách: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBloodTypes(searchTerm);
    }, [searchTerm, fetchBloodTypes]);

    const groupedBloodTypes = useMemo(() => {
        if (!bloodTypes) return {};
        return bloodTypes.reduce((acc, current) => {
            const group = current.bloodGroup;
            if (!acc[group]) acc[group] = [];
            acc[group].push(current);
            return acc;
        }, {});
    }, [bloodTypes]);

    // Effect để tự động chọn tab đầu tiên khi dữ liệu thay đổi
    useEffect(() => {
        const groups = Object.keys(groupedBloodTypes).sort();
        if (groups.length > 0) {
            // Nếu tab hiện tại không còn tồn tại trong danh sách mới (do tìm kiếm)
            // hoặc chưa có tab nào được chọn, thì chọn tab đầu tiên
            if (!groups.includes(activeTab)) {
                setActiveTab(groups[0]);
            }
        } else {
            setActiveTab(null); // Không có dữ liệu thì không có tab nào
        }
    }, [groupedBloodTypes, activeTab]);

    // --- HANDLERS ---
    const handleSearch = (term) => setSearchTerm(term);
    const handleOpenModal = (bloodType = null) => {
        setEditingBloodType(bloodType);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBloodType(null);
    };
    const handleSaveSuccess = () => {
        fetchBloodTypes(searchTerm);
        handleCloseModal();
    };
    const handleDelete = async (id, description) => {
        const displayName = description || `ID: ${id}`;
        if (window.confirm(`Bạn có chắc chắn muốn xóa loại máu "${displayName}" không?`)) {
            const toastId = toast.loading('Đang xóa...');
            try {
                await bloodTypeService.delete(id);
                toast.success('Xóa thành công!', { id: toastId });
                fetchBloodTypes(searchTerm);
            } catch (error) {
                toast.error(`Lỗi khi xóa: ${error.message}`, { id: toastId });
            }
        }
    };
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    // --- RENDER ---
    return (
        <div className="p-4 md:p-6 lg:p-8 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <header className="bg-white shadow-sm rounded-lg p-4 md:p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 md:mb-0">
                            Quản lý Loại máu
                        </h1>
                        <div className="flex items-center space-x-2 w-full md:w-auto">                 
                            {isAdmin && (
                                <Button onClick={() => handleOpenModal()} variant="primary" disabled={isLoading} className="flex-shrink-0">
                                    <PlusCircle size={20} className="mr-2" /> Thêm mới
                                </Button>
                            )}
                        </div>
                    </div>
                </header>

                <main>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-10"><LoadingSpinner size="12" /></div>
                    ) : (
                        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-slate-200">
                            {/* THANH ĐIỀU HƯỚNG TABS */}
                            <div className="border-b border-slate-200">
                                <nav className="-mb-px flex space-x-44 overflow-x-auto px-8" aria-label="Tabs">
                                    {Object.keys(groupedBloodTypes).sort().map(groupName => (
                                        <button
                                            key={groupName}
                                            onClick={() => setActiveTab(groupName)}
                                            className={`whitespace-nowrap py-4 px-3 border-b-2 font-semibold text-sm transition-colors
                                                ${activeTab === groupName
                                                ? 'border-red-600 text-red-700'
                                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                            }`}
                                        >
                                            {groupName}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* NỘI DUNG TABS */}
                            <div className="p-2 md:p-4">
                                {activeTab && groupedBloodTypes[activeTab] ? (
                                    <div className="divide-y divide-slate-100">
                                        {groupedBloodTypes[activeTab].map(item => (
                                            <div key={item.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 gap-4 hover:bg-slate-50/50 rounded-lg">
                                                <div className="flex-grow">
                                                    <p className="text-base font-semibold text-slate-900">{item.componentType}</p>
                                                    <p className="text-sm text-slate-600 italic mt-1">{item.description || "Không có mô tả."}</p>
                                                </div>
                                                <div className="flex items-center space-x-3 flex-shrink-0 self-end md:self-center">
                                                    {isAdmin ? (
                                                        <>
                                                            <Button onClick={() => handleOpenModal(item)} variant="outline" size="sm">
                                                                <Edit3 size={16} className="mr-2" /> Sửa
                                                            </Button>
                                                            <Button onClick={() => handleDelete(item.id, `${item.bloodGroup} - ${item.componentType}`)} variant="danger-outline" size="sm">
                                                                <Trash2 size={16} className="mr-2" /> Xóa
                                                            </Button>
                                                        </>
                                                    ) : <span className="text-sm text-slate-500">Không có quyền</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center p-12">
                                        <h3 className="text-lg font-semibold text-slate-700">Không có dữ liệu</h3>
                                        <p className="text-slate-500 mt-2">Không có loại máu nào phù hợp với tìm kiếm của bạn.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <BloodTypeFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSaveSuccess={handleSaveSuccess}
                bloodType={editingBloodType}
            />
        </div>
    );
};

export default AdminBloodTypePage;