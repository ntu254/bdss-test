import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus as UserPlusIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';
import bloodTypeService from '../services/bloodTypeService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        password: '',
        confirmPassword: '',
        bloodTypeId: '',
        agreeTerms: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [bloodTypesFromApi, setBloodTypesFromApi] = useState([]);
    const [isFetchingBloodTypes, setIsFetchingBloodTypes] = useState(false);

    const { register, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const fetchBloodTypes = useCallback(async () => {
        setIsFetchingBloodTypes(true);
        try {
            const response = await bloodTypeService.getAll();
            setBloodTypesFromApi(response || []);
        } catch (error) {
            toast.error(error + "Lỗi khi tải danh sách nhóm máu.");
            setBloodTypesFromApi([]);
        } finally {
            setIsFetchingBloodTypes(false);
        }
    }, []);


    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        } else {
            fetchBloodTypes();
        }
    }, [isAuthenticated, navigate, fetchBloodTypes]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!');
            return;
        }
        if (!formData.agreeTerms) {
            toast.error('Bạn phải đồng ý với Điều khoản sử dụng và Chính sách bảo mật.');
            return;
        }
        if (formData.password.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        const toastId = toast.loading("Đang đăng ký...");
        try {
            const registrationData = {
                ...formData,
                bloodTypeId: formData.bloodTypeId ? parseInt(formData.bloodTypeId, 10) : null,
            };

            delete registrationData.confirmPassword;
            delete registrationData.agreeTerms;

            await register(registrationData);

            toast.success("Đăng ký thành công! Vui lòng đăng nhập.", { id: toastId, duration: 4000 });
            navigate('/login');
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data || err.message || "Đăng ký thất bại. Vui lòng thử lại.";
            toast.error(errorMsg, { id: toastId });
        }
    };

    return (
        <div className="max-h-screen bg-gray-50 flex flex-col">
            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
                <div className="max-w-lg w-full space-y-8">
                    <div className="text-center">
                        <UserPlusIcon className="mx-auto h-12 w-auto text-red-600" />
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Tạo tài khoản mới
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Hoặc{' '}
                            <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
                                đăng nhập nếu đã có tài khoản
                            </Link>
                        </p>
                    </div>

                    <div className="bg-white py-8 px-6 shadow-xl rounded-xl sm:px-10">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <InputField
                                label="Họ và tên đầy đủ"
                                id="fullName"
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Ví dụ: Nguyễn Văn An"
                                required
                                disabled={authLoading || isFetchingBloodTypes}
                            />
                            <InputField
                                label="Địa chỉ Email"
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="you@example.com"
                                required
                                disabled={authLoading || isFetchingBloodTypes}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                                <InputField
                                    label="Ngày sinh"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                    required
                                    disabled={authLoading || isFetchingBloodTypes}
                                />
                                <InputField
                                    label="Số điện thoại"
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="09xxxxxxxx"
                                    required
                                    disabled={authLoading || isFetchingBloodTypes}
                                />
                            </div>

                            <InputField
                                label="Địa chỉ"
                                id="address"
                                name="address"
                                type="text"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                                required
                                disabled={authLoading || isFetchingBloodTypes}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                                <InputField
                                    label="Mật khẩu"
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Ít nhất 6 ký tự"
                                    required
                                    disabled={authLoading || isFetchingBloodTypes}
                                    hasIcon={true}
                                    icon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    onIconClick={() => setShowPassword(!showPassword)}
                                />
                                <InputField
                                    label="Xác nhận mật khẩu"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Nhập lại mật khẩu"
                                    required
                                    disabled={authLoading || isFetchingBloodTypes}
                                    hasIcon={true}
                                    icon={showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label htmlFor="bloodTypeId" className="block text-sm font-medium text-gray-700 mb-1">Nhóm máu (Tùy chọn)</label>
                                {isFetchingBloodTypes ? <div className="py-2"><LoadingSpinner size="6" /></div> : (
                                    <select
                                        id="bloodTypeId"
                                        name="bloodTypeId"
                                        value={formData.bloodTypeId}
                                        onChange={handleInputChange}
                                        disabled={authLoading || isFetchingBloodTypes || bloodTypesFromApi.length === 0}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                    >
                                        <option value="">-- Chọn nhóm máu --</option>
                                        {
                                            bloodTypesFromApi
                                                .filter((value, index, self) =>
                                                        index === self.findIndex((t) => (
                                                            t.bloodGroup === value.bloodGroup
                                                        ))
                                                )
                                                .map(bt => (
                                                    <option key={bt.id} value={bt.id}>{bt.bloodGroup}</option>
                                                ))
                                        }
                                    </select>
                                )}
                                {bloodTypesFromApi.length === 0 && !isFetchingBloodTypes && <p className="text-xs text-gray-500 mt-1">Không tải được danh sách nhóm máu.</p>}
                            </div>
                            <div className="flex items-start pt-2">
                                <input
                                    id="agreeTerms"
                                    name="agreeTerms"
                                    type="checkbox"
                                    checked={formData.agreeTerms}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                                    disabled={authLoading || isFetchingBloodTypes}
                                    required
                                />
                                <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                                    Tôi đã đọc và đồng ý với{' '}
                                    <Link to="/terms" className="font-medium text-red-600 hover:text-red-500">Điều khoản sử dụng</Link> và{' '}
                                    <Link to="/privacy" className="font-medium text-red-600 hover:text-red-500">Chính sách bảo mật</Link> của LifeBlood.
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={authLoading || isFetchingBloodTypes}
                                isLoading={authLoading}
                                variant="primary"
                                size="lg"
                            >
                                Đăng ký tài khoản
                            </Button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RegisterPage;