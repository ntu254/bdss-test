// src/pages/RequestDonationPage.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Calendar, MapPin, MessageSquare, Send, ChevronDown } from 'lucide-react';

import MainLayout from '../components/layout/MainLayout';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import TextareaField from '../components/common/TextareaField';
import appointmentService from '../services/appointmentService';

const DONATION_LOCATIONS = [
    'Trung tâm hiến máu TP.HCM (201 Nguyễn Thị Minh Khai, Q1)',
    'Bệnh viện Truyền máu Huyết học (118 Hồng Bàng, P12, Q5)',
    'Điểm hiến máu Chữ Thập Đỏ (201 Nguyễn Văn Cừ, P3, Q5)',
    'Bệnh viện Chợ Rẫy (201B Nguyễn Chí Thanh, P12, Q5)',
];

const getMinDateTime = () => {
    const now = new Date();
    // Adjust for local timezone if necessary before formatting
    const tzOffset = now.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = new Date(now - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
};

const RequestDonationPage = () => {
    const [formData, setFormData] = useState({
        appointmentDate: '',
        location: DONATION_LOCATIONS[0],
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const minDateTime = useMemo(() => getMinDateTime(), []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.appointmentDate || !formData.location) {
            toast.error("Vui lòng chọn ngày hẹn và địa điểm.");
            return;
        }
        setLoading(true);
        try {
            await appointmentService.requestDonationAppointment(formData);
            toast.success("Gửi yêu cầu đặt lịch hẹn thành công! Chúng tôi sẽ sớm liên hệ với bạn.");
            navigate('/profile');
        } catch (error) {
            toast.error(error.response?.data?.message || "Gửi yêu cầu thất bại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        // <MainLayout>
        <div className="container mx-auto max-w-2xl py-12 px-4">
            <div className="text-center mb-8">
                <Calendar className="mx-auto h-12 w-auto text-red-600" />
                <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Đặt Lịch Hẹn Hiến Máu
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                    Chủ động chọn thời gian và địa điểm phù hợp để việc hiến máu trở nên dễ dàng hơn.
                </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <InputField
                        label="Chọn ngày giờ hẹn"
                        id="appointmentDate"
                        name="appointmentDate"
                        type="datetime-local"
                        value={formData.appointmentDate}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        icon={<Calendar size={20} />}
                        min={minDateTime}
                    />

                    {/* --- FIX: Replaced the failing InputField with a manually styled select dropdown --- */}
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Chọn địa điểm
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <MapPin size={20} />
                            </div>
                            <select
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="block w-full appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                            >
                                {DONATION_LOCATIONS.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <TextareaField
                        label="Ghi chú (tùy chọn)"
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        disabled={loading}
                        icon={<MessageSquare size={20} />}
                        placeholder="Ví dụ: Tôi chỉ có thể đến sau 18:00..."
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                        isLoading={loading}
                        variant="primary"
                        size="lg"
                    >
                        <Send className="mr-2 h-5 w-5" />
                        {loading ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
                    </Button>
                </form>
            </div>
        </div>
        // </MainLayout>
    );
};

export default RequestDonationPage;