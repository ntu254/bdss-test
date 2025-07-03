// src/pages/admin/AdminEmergencyRequestsPage.jsx
import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Phone, Clock, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import bloodRequestService from '../../services/bloodRequestService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import PageContainer from '../../components/layout/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import Modal from '../../components/common/Modal';
import InputField from '../../components/common/InputField';

const AdminEmergencyRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        bloodTypeId: '',
        quantityInUnits: '',
        urgency: 'CRITICAL',
        reason: '',
        contactPhone: '',
        deliveryAddress: '',
        latitude: '',
        longitude: ''
    });

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await bloodRequestService.searchActiveRequests({
                latitude: 10.8231, // Default Ho Chi Minh City coordinates
                longitude: 106.6297,
                radius: 50
            });
            setRequests(response.data);
        } catch (error) {
            toast.error('Lỗi khi tải danh sách yêu cầu khẩn cấp');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRequest = async (e) => {
        e.preventDefault();
        try {
            await bloodRequestService.createBloodRequest(formData);
            toast.success('Tạo yêu cầu khẩn cấp thành công');
            setIsModalOpen(false);
            fetchRequests();
            setFormData({
                bloodTypeId: '',
                quantityInUnits: '',
                urgency: 'CRITICAL',
                reason: '',
                contactPhone: '',
                deliveryAddress: '',
                latitude: '',
                longitude: ''
            });
        } catch (error) {
            toast.error('Lỗi khi tạo yêu cầu khẩn cấp');
        }
    };

    const handleStatusUpdate = async (requestId, status) => {
        try {
            await bloodRequestService.updateRequestStatus(requestId, status);
            toast.success('Cập nhật trạng thái thành công');
            fetchRequests();
        } catch (error) {
            toast.error('Lỗi khi cập nhật trạng thái');
        }
    };

    const getUrgencyBadge = (urgency) => {
        const urgencyConfig = {
            'CRITICAL': { variant: 'error', label: 'Cực kỳ khẩn cấp' },
            'URGENCY': { variant: 'warning', label: 'Khẩn cấp' },
            'NORMAL': { variant: 'info', label: 'Bình thường' }
        };

        const config = urgencyConfig[urgency] || { variant: 'default', label: urgency };
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'PENDING': { variant: 'warning', label: 'Chờ xử lý' },
            'APPROVED': { variant: 'info', label: 'Đã duyệt' },
            'FULFILLED': { variant: 'success', label: 'Đã hoàn thành' },
            'REJECTED': { variant: 'error', label: 'Từ chối' },
            'CANCELLED': { variant: 'error', label: 'Đã hủy' }
        };

        const config = statusConfig[status] || { variant: 'default', label: status };
        return <Badge variant={config.variant}>{config.label}</Badge>;
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
                title="Quản lý Yêu cầu Khẩn cấp"
                subtitle="Theo dõi và xử lý các yêu cầu máu khẩn cấp"
                actions={
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Tạo yêu cầu khẩn cấp
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requests.map((request) => (
                    <Card key={request.id} hover>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">
                                    Cần máu {request.bloodType?.bloodGroup}
                                </CardTitle>
                                {getUrgencyBadge(request.urgency)}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Số lượng:</span>
                                <span className="font-semibold">{request.quantityInUnits} đơn vị</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Trạng thái:</span>
                                {getStatusBadge(request.status)}
                            </div>

                            {request.contactPhone && (
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">{request.contactPhone}</span>
                                </div>
                            )}

                            {request.deliveryAddress && (
                                <div className="flex items-start space-x-2">
                                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                                    <span className="text-sm">{request.deliveryAddress}</span>
                                </div>
                            )}

                            <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">
                                    {new Date(request.createdAt).toLocaleString('vi-VN')}
                                </span>
                            </div>

                            {request.reason && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Lý do:</p>
                                    <p className="text-sm">{request.reason}</p>
                                </div>
                            )}

                            {request.status === 'PENDING' && (
                                <div className="flex space-x-2 pt-2">
                                    <Button 
                                        size="sm" 
                                        className="flex-1"
                                        onClick={() => handleStatusUpdate(request.id, 'APPROVED')}
                                    >
                                        Duyệt
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="flex-1"
                                        onClick={() => handleStatusUpdate(request.id, 'REJECTED')}
                                    >
                                        Từ chối
                                    </Button>
                                </div>
                            )}

                            {request.status === 'APPROVED' && (
                                <Button 
                                    size="sm" 
                                    className="w-full"
                                    onClick={() => handleStatusUpdate(request.id, 'FULFILLED')}
                                >
                                    Đánh dấu hoàn thành
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Create Request Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Tạo yêu cầu khẩn cấp"
                size="lg"
            >
                <form onSubmit={handleCreateRequest} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            label="Loại máu cần"
                            name="bloodTypeId"
                            type="number"
                            value={formData.bloodTypeId}
                            onChange={(e) => setFormData({...formData, bloodTypeId: e.target.value})}
                            required
                        />
                        <InputField
                            label="Số lượng (đơn vị)"
                            name="quantityInUnits"
                            type="number"
                            value={formData.quantityInUnits}
                            onChange={(e) => setFormData({...formData, quantityInUnits: e.target.value})}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mức độ khẩn cấp
                        </label>
                        <select
                            value={formData.urgency}
                            onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="CRITICAL">Cực kỳ khẩn cấp</option>
                            <option value="URGENCY">Khẩn cấp</option>
                            <option value="NORMAL">Bình thường</option>
                        </select>
                    </div>

                    <InputField
                        label="Lý do"
                        name="reason"
                        as="textarea"
                        rows={3}
                        value={formData.reason}
                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    />

                    <InputField
                        label="Số điện thoại liên hệ"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                    />

                    <InputField
                        label="Địa chỉ giao máu"
                        name="deliveryAddress"
                        as="textarea"
                        rows={2}
                        value={formData.deliveryAddress}
                        onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            label="Vĩ độ"
                            name="latitude"
                            type="number"
                            step="any"
                            value={formData.latitude}
                            onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                            required
                        />
                        <InputField
                            label="Kinh độ"
                            name="longitude"
                            type="number"
                            step="any"
                            value={formData.longitude}
                            onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Hủy
                        </Button>
                        <Button type="submit">
                            Tạo yêu cầu
                        </Button>
                    </div>
                </form>
            </Modal>
        </PageContainer>
    );
};

export default AdminEmergencyRequestsPage;