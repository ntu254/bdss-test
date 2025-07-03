// src/pages/admin/AdminUserDetailPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Edit3, Mail, Phone, UserCircle, MapPin, Briefcase, Shield, Heart, CalendarDays, Clock, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

import userService from '../../services/userService'; //
import LoadingSpinner from '../../components/common/LoadingSpinner'; //
import Button from '../../components/common/Button'; //

const DetailItem = ({ icon: IconComponent, label, value, highlight = false }) => {
    const Icon = IconComponent;
    return (
        <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Icon size={16} className="mr-2 text-red-600" />
                {label}
            </dt>
            <dd className={`mt-1 text-sm ${highlight ? 'font-semibold text-red-700' : 'text-gray-900'} sm:mt-0 sm:col-span-2`}>
                {value !== null && value !== undefined && value !== '' ? value : <span className="italic text-gray-400">Chưa có thông tin</span>}
            </dd>
        </div>
    );
};

const AdminUserDetailPage = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserData = useCallback(async () => {
        setIsLoading(true);
        try {
            console.log(`Fetching user data for ID (component): ${userId}`);
            const userData = await userService.getUserByIdForAdmin(userId);
            console.log("User data received (component):", userData);
            setUser(userData);
        } catch (error) {
            console.error("Error fetching user data (component):", error);
            toast.error(`Lỗi khi tải thông tin người dùng: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><LoadingSpinner size="12" /></div>;
    }

    if (!user && !isLoading) { // Nếu không tải nữa VÀ user là null (có thể do lỗi fetch hoặc user không tồn tại)
        return (
            <div className="p-6 text-center">
                <p className="text-xl text-gray-700">Không tìm thấy thông tin người dùng hoặc có lỗi xảy ra.</p>
                <Link to="/admin/users">
                    <Button variant="secondary" className="mt-4">
                        <ArrowLeft size={18} className="mr-2" /> Quay lại
                    </Button>
                </Link>
            </div>
        );
    }

    // Chỉ render phần còn lại nếu user có dữ liệu
    if (user) {
        const bloodTypeDesc = user.bloodTypeDescription || 'Chưa cập nhật'; //

        return (
            <div className="p-6 max-w-4xl mx-auto">
                <Link to="/admin/users" className="flex items-center text-red-600 hover:text-red-800 mb-4">
                    <ArrowLeft size={20} className="mr-2" />
                    Quay lại danh sách người dùng
                </Link>

                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-6 py-5 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">{user.fullName}</h1>
                                <p className="text-sm text-gray-500">ID: {user.id} - <span className="font-semibold">{user.username}</span></p>
                            </div>
                            <Link to={`/admin/users/edit/${userId}`}>
                                <Button variant="outline">
                                    <Edit3 size={16} className="mr-2" /> Chỉnh sửa
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="px-6 py-5">
                        <dl className="divide-y divide-gray-200">
                            <h3 className="text-lg font-semibold text-gray-700 my-3">Thông tin liên hệ</h3>
                            <DetailItem icon={Mail} label="Email" value={user.email} />
                            <DetailItem icon={Phone} label="Số điện thoại" value={user.phone} />
                            <DetailItem icon={MapPin} label="Địa chỉ" value={user.address} />
                            <DetailItem icon={UserCircle} label="Liên hệ khẩn cấp" value={user.emergencyContact} />

                            <h3 className="text-lg font-semibold text-gray-700 pt-5 my-3">Thông tin cá nhân & Y tế</h3>
                            <DetailItem icon={CalendarDays} label="Ngày sinh" value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : null} />
                            <DetailItem icon={UserCircle} label="Giới tính" value={user.gender} />
                            <DetailItem icon={Heart} label="Nhóm máu" value={bloodTypeDesc} highlight={bloodTypeDesc !== 'Chưa cập nhật'} />
                            <DetailItem icon={Briefcase} label="Tình trạng bệnh lý" value={user.medicalConditions} />
                            <DetailItem icon={CalendarDays} label="Lần hiến máu cuối" value={user.lastDonationDate ? new Date(user.lastDonationDate).toLocaleDateString() : null} />
                            <DetailItem
                                icon={user.isReadyToDonate ? CheckCircle : XCircle}
                                label="Sẵn sàng hiến máu"
                                value={user.isReadyToDonate ? 'Có' : 'Không'}
                                highlight={user.isReadyToDonate === true}
                            />

                            <h3 className="text-lg font-semibold text-gray-700 pt-5 my-3">Thông tin tài khoản</h3>
                            <DetailItem icon={Shield} label="Vai trò" value={user.role} highlight={true} />
                            <DetailItem
                                icon={user.status === 'Active' ? CheckCircle : (user.status === 'Suspended' ? XCircle : HelpCircle)}
                                label="Trạng thái"
                                value={user.status}
                                highlight={user.status === 'Active'}
                            />
                            <DetailItem
                                icon={user.emailVerified ? CheckCircle : XCircle}
                                label="Email đã xác thực"
                                value={user.emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                            />
                            <DetailItem
                                icon={user.phoneVerified ? CheckCircle : XCircle}
                                label="SĐT đã xác thực"
                                value={user.phoneVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                            />
                            <DetailItem icon={Clock} label="Ngày tạo" value={user.createdAt ? new Date(user.createdAt).toLocaleString() : null} />
                            <DetailItem icon={Clock} label="Cập nhật lần cuối" value={user.updatedAt ? new Date(user.updatedAt).toLocaleString() : null} />
                        </dl>
                    </div>
                </div>
            </div>
        );
    };
    return null; // Fallback nếu không rơi vào các trường hợp trên (ít khả năng)
};

export default AdminUserDetailPage;