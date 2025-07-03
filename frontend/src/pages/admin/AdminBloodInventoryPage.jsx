// src/pages/admin/AdminBloodInventoryPage.jsx
import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, Droplet } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import PageContainer from '../../components/layout/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import Modal from '../../components/common/Modal';
import InputField from '../../components/common/InputField';
import apiClient from '../../services/apiClient';

const AdminBloodInventoryPage = () => {
    const [inventory, setInventory] = useState([]);
    const [bloodTypes, setBloodTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        bloodTypeId: '',
        quantityMl: '',
        expiryDate: '',
        location: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [inventoryResponse, bloodTypesResponse] = await Promise.all([
                apiClient.get('/blood-inventory'),
                apiClient.get('/blood-types')
            ]);
            setInventory(inventoryResponse.data);
            setBloodTypes(bloodTypesResponse.data);
        } catch (error) {
            toast.error('Lỗi khi tải dữ liệu kho máu');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await apiClient.put(`/blood-inventory/${editingItem.id}`, formData);
                toast.success('Cập nhật kho máu thành công');
            } else {
                await apiClient.post('/blood-inventory', formData);
                toast.success('Thêm kho máu thành công');
            }
            setIsModalOpen(false);
            setEditingItem(null);
            fetchData();
            resetForm();
        } catch (error) {
            toast.error('Lỗi khi lưu dữ liệu kho máu');
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            bloodTypeId: item.bloodTypeId,
            quantityMl: item.quantityMl,
            expiryDate: item.expiryDate || '',
            location: item.location || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa mục này?')) {
            try {
                await apiClient.delete(`/blood-inventory/${id}`);
                toast.success('Xóa thành công');
                fetchData();
            } catch (error) {
                toast.error('Lỗi khi xóa');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            bloodTypeId: '',
            quantityMl: '',
            expiryDate: '',
            location: ''
        });
    };

    const getStockLevel = (quantity) => {
        if (quantity < 1000) return { variant: 'error', label: 'Thiếu hụt' };
        if (quantity < 3000) return { variant: 'warning', label: 'Thấp' };
        return { variant: 'success', label: 'Đủ' };
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner size="12" />
            </div>
        );
    }

    return (
        <PageContainer>
            <PageHeader
                title="Quản lý Kho máu"
                subtitle="Theo dõi và quản lý tồn kho các loại máu"
                actions={
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm kho máu
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inventory.map((item) => {
                    const stockLevel = getStockLevel(item.quantityMl);
                    return (
                        <Card key={item.id} hover>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center">
                                        <Droplet className="w-5 h-5 mr-2 text-red-500" />
                                        {item.bloodTypeDetails?.bloodGroup} ({item.bloodTypeDetails?.componentType})
                                    </CardTitle>
                                    <Badge variant={stockLevel.variant}>{stockLevel.label}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Số lượng:</span>
                                    <span className="font-semibold">{item.quantityMl} ml</span>
                                </div>

                                {item.expiryDate && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Hạn sử dụng:</span>
                                        <span className="text-sm">{new Date(item.expiryDate).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                )}

                                {item.location && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Vị trí:</span>
                                        <span className="text-sm">{item.location}</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Cập nhật:</span>
                                    <span className="text-sm">{new Date(item.lastUpdated).toLocaleDateString('vi-VN')}</span>
                                </div>

                                <div className="flex space-x-2 pt-2">
                                    <Button 
                                        size="sm" 
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => handleEdit(item)}
                                    >
                                        <Edit className="w-4 h-4 mr-1" />
                                        Sửa
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="outline"
                                        className="flex-1 text-red-600 hover:text-red-700"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Xóa
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingItem(null);
                    resetForm();
                }}
                title={editingItem ? "Chỉnh sửa kho máu" : "Thêm kho máu"}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Loại máu
                        </label>
                        <select
                            value={formData.bloodTypeId}
                            onChange={(e) => setFormData({...formData, bloodTypeId: e.target.value})}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                            required
                        >
                            <option value="">Chọn loại máu</option>
                            {bloodTypes.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.bloodGroup} ({type.componentType})
                                </option>
                            ))}
                        </select>
                    </div>

                    <InputField
                        label="Số lượng (ml)"
                        name="quantityMl"
                        type="number"
                        value={formData.quantityMl}
                        onChange={(e) => setFormData({...formData, quantityMl: e.target.value})}
                        required
                    />

                    <InputField
                        label="Hạn sử dụng"
                        name="expiryDate"
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    />

                    <InputField
                        label="Vị trí lưu trữ"
                        name="location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="Ví dụ: Tủ lạnh A1, Kệ B2"
                    />

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                                setIsModalOpen(false);
                                setEditingItem(null);
                                resetForm();
                            }}
                        >
                            Hủy
                        </Button>
                        <Button type="submit">
                            {editingItem ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </PageContainer>
    );
};

export default AdminBloodInventoryPage;