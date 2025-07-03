import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import donationService from '../../services/donationService';
import LoadingSpinner from '../common/LoadingSpinner';
import { Calendar, MapPin } from 'lucide-react';

const DonationHistoryList = () => {
    const [donations, setDonations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await donationService.getUserDonationHistory();
                setDonations(response.data);
            } catch (error) {
                toast.error('Lỗi khi tải lịch sử hiến máu.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center py-10"><LoadingSpinner /></div>;
    }

    if (donations.length === 0) {
        return <p className="text-center text-gray-500 py-10">Bạn chưa có lịch sử hiến máu nào.</p>;
    }

    const getStatusChip = (status) => {
        switch (status) {
            case 'COMPLETED':
                return <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Hoàn thành</span>;
            case 'PENDING':
                return <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">Chờ xử lý</span>;
            case 'CANCELLED':
                return <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">Đã hủy</span>;
            default:
                return <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">{status}</span>;
        }
    };

    return (
        <div className="space-y-4">
            {donations.map((donation) => (
                <div key={donation.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 mr-2 text-red-500" />
                                <span className="font-semibold">{new Date(donation.donationDate).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <MapPin className="w-4 h-4 mr-2 text-red-500" />
                                <span>{donation.location || 'Tại trung tâm'}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            {getStatusChip(donation.status)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DonationHistoryList;