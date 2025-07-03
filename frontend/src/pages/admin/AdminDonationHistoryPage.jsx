// src/pages/admin/AdminDonationHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, User, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import donationService from '../../services/donationService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import PageContainer from '../../components/layout/PageContainer';
import PageHeader from '../../components/layout/PageHeader';

const AdminDonationHistoryPage = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDonation, setSelectedDonation] = useState(null);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            setLoading(true);
            const response = await donationService.getAllDonationRequests();
            setDonations(response.data);
        } catch (error) {
            toast.error('Lỗi khi tải lịch sử hiến máu');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'PENDING_APPROVAL': { variant: 'warning', label: 'Chờ duyệt' },
            'REJECTED': { variant: 'error', label: 'Từ chối' },
            'APPOINTMENT_PENDING': { variant: 'info', label: 'Chờ lịch hẹn' },
            'APPOINTMENT_SCHEDULED': { variant: 'info', label: 'Đã lên lịch' },
            'HEALTH_CHECK_PASSED': { variant: 'success', label: 'Khám đạt' },
            'HEALTH_CHECK_FAILED': { variant: 'error', label: 'Khám không đạt' },
            'BLOOD_COLLECTED': { variant: 'success', label: 'Đã lấy máu' },
            'TESTING_PASSED': { variant: 'success', label: 'Xét nghiệm đạt' },
            'TESTING_FAILED': { variant: 'error', label: 'Xét nghiệm không đạt' },
            'COMPLETED': { variant: 'success', label: 'Hoàn thành' },
            'CANCELLED': { variant: 'error', label: 'Đã hủy' }
        };

        const config = statusConfig[status] || { variant: 'default', label: status };
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const handleStatusUpdate = async (donationId, newStatus) => {
        try {
            await donationService.updateDonationStatus(donationId, { newStatus });
            toast.success('Cập nhật trạng thái thành công');
            fetchDonations();
        } catch (error) {
            toast.error('Lỗi khi cập nhật trạng thái');
        }
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
                title="Quản lý Lịch sử Hiến máu"
                subtitle="Theo dõi và quản lý tất cả các quy trình hiến máu"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Donation List */}
                <div className="lg:col-span-2 space-y-4">
                    {donations.map((donation) => (
                        <Card key={donation.id} hover className="cursor-pointer" onClick={() => setSelectedDonation(donation)}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <User className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <h3 className="font-semibold">{donation.donor?.fullName}</h3>
                                            <p className="text-sm text-gray-500">{donation.donor?.email}</p>
                                        </div>
                                    </div>
                                    {getStatusBadge(donation.status)}
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{new Date(donation.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    {donation.appointment && (
                                        <div className="flex items-center space-x-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{new Date(donation.appointment.appointmentDateTime).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                    )}
                                </div>

                                {donation.note && (
                                    <p className="mt-2 text-sm text-gray-600">{donation.note}</p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Donation Details */}
                <div className="lg:col-span-1">
                    {selectedDonation ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Chi tiết Hiến máu</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium">Người hiến máu</h4>
                                    <p className="text-sm text-gray-600">{selectedDonation.donor?.fullName}</p>
                                    <p className="text-sm text-gray-600">{selectedDonation.donor?.email}</p>
                                </div>

                                <div>
                                    <h4 className="font-medium">Trạng thái</h4>
                                    {getStatusBadge(selectedDonation.status)}
                                </div>

                                {selectedDonation.appointment && (
                                    <div>
                                        <h4 className="font-medium">Lịch hẹn</h4>
                                        <p className="text-sm text-gray-600">
                                            {new Date(selectedDonation.appointment.appointmentDateTime).toLocaleString('vi-VN')}
                                        </p>
                                        <p className="text-sm text-gray-600">{selectedDonation.appointment.location}</p>
                                    </div>
                                )}

                                {selectedDonation.note && (
                                    <div>
                                        <h4 className="font-medium">Ghi chú</h4>
                                        <p className="text-sm text-gray-600">{selectedDonation.note}</p>
                                    </div>
                                )}

                                {/* Status Update Actions */}
                                <div className="space-y-2">
                                    <h4 className="font-medium">Cập nhật trạng thái</h4>
                                    {selectedDonation.status === 'PENDING_APPROVAL' && (
                                        <div className="space-y-2">
                                            <Button 
                                                size="sm" 
                                                className="w-full"
                                                onClick={() => handleStatusUpdate(selectedDonation.id, 'APPOINTMENT_PENDING')}
                                            >
                                                Duyệt đơn
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="w-full"
                                                onClick={() => handleStatusUpdate(selectedDonation.id, 'REJECTED')}
                                            >
                                                Từ chối
                                            </Button>
                                        </div>
                                    )}
                                    
                                    {selectedDonation.status === 'APPOINTMENT_SCHEDULED' && (
                                        <Button 
                                            size="sm" 
                                            className="w-full"
                                            onClick={() => handleStatusUpdate(selectedDonation.id, 'HEALTH_CHECK_PASSED')}
                                        >
                                            Khám sàng lọc đạt
                                        </Button>
                                    )}

                                    {selectedDonation.status === 'HEALTH_CHECK_PASSED' && (
                                        <Button 
                                            size="sm" 
                                            className="w-full"
                                            onClick={() => handleStatusUpdate(selectedDonation.id, 'BLOOD_COLLECTED')}
                                        >
                                            Đã lấy máu
                                        </Button>
                                    )}

                                    {selectedDonation.status === 'BLOOD_COLLECTED' && (
                                        <div className="space-y-2">
                                            <Button 
                                                size="sm" 
                                                className="w-full"
                                                onClick={() => handleStatusUpdate(selectedDonation.id, 'TESTING_PASSED')}
                                            >
                                                Xét nghiệm đạt
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="w-full"
                                                onClick={() => handleStatusUpdate(selectedDonation.id, 'TESTING_FAILED')}
                                            >
                                                Xét nghiệm không đạt
                                            </Button>
                                        </div>
                                    )}

                                    {selectedDonation.status === 'TESTING_PASSED' && (
                                        <Button 
                                            size="sm" 
                                            className="w-full"
                                            onClick={() => handleStatusUpdate(selectedDonation.id, 'COMPLETED')}
                                        >
                                            Hoàn thành
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="p-6 text-center text-gray-500">
                                Chọn một quy trình hiến máu để xem chi tiết
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </PageContainer>
    );
};

export default AdminDonationHistoryPage;