import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Droplet, AlertTriangle, Clock } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import bloodRequestService from '../services/bloodRequestService';

const BloodRequestCard = ({ request }) => {
    const urgencyStyles = {
        HIGH: 'bg-red-100 border-red-500 text-red-700',
        MEDIUM: 'bg-yellow-100 border-yellow-500 text-yellow-700',
        LOW: 'bg-green-100 border-green-500 text-green-700',
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 transition-transform hover:scale-105" style={{ borderLeftColor: urgencyStyles[request.urgencyLevel]?.borderColor || '#ccc' }}>
            <div className="flex justify-between items-start">
                <div className="flex items-center">
                    <Droplet className="h-8 w-8 text-red-500 mr-3" />
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Cần nhóm máu: {request.bloodType.name}</h3>
                        <p className="text-sm text-gray-500">Số lượng: {request.quantity} đơn vị</p>
                    </div>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${urgencyStyles[request.urgencyLevel]}`}>
                    {request.urgencyLevel}
                </span>
            </div>
            <p className="text-gray-700 mt-3">{request.notes}</p>
            <div className="text-right text-xs text-gray-400 mt-4 flex items-center justify-end">
                <Clock size={14} className="mr-1" />
                <span>Yêu cầu ngày: {new Date(request.requestDate).toLocaleDateString('vi-VN')}</span>
            </div>
        </div>
    );
};


const BloodRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            try {
                const response = await bloodRequestService.getAllPublicBloodRequests();
                setRequests(response.data);
            } catch (error) {
                toast.error("Không thể tải danh sách yêu cầu máu.");
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    return (
            <div className="container mx-auto py-12 px-4">
                <div className="text-center mb-10">
                    <AlertTriangle className="mx-auto h-12 w-auto text-yellow-500" />
                    <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Các Trường Hợp Cần Máu Khẩn Cấp
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Mỗi giọt máu cho đi, một cuộc đời ở lại. Hãy cùng chung tay giúp đỡ những bệnh nhân đang cần máu.
                    </p>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {requests.length > 0 ? (
                            requests.map(req => <BloodRequestCard key={req.id} request={req} />)
                        ) : (
                            <p className="col-span-full text-center text-gray-500">Hiện tại không có yêu cầu khẩn cấp nào.</p>
                        )}
                    </div>
                )}
            </div>
    );
};

export default BloodRequestsPage;