// src/pages/admin/AdminUserCreatePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, UserPlus } from 'lucide-react';

import userService from '../../services/userService'; //
import InputField from '../../components/common/InputField'; //
import Button from '../../components/common/Button'; //
import LoadingSpinner from '../../components/common/LoadingSpinner'; //

const AdminUserCreatePage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        password: '',
        confirmPassword: '',
        roleName: 'Member', // Default role
        bloodTypeId: '',
        phone: '',
        status: 'Active', // Default status
        emailVerified: false,
        phoneVerified: false,
    });
    const [roles, setRoles] = useState([]);
    const [bloodTypes, setBloodTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const rolesData = await userService.getRoles();
                setRoles(rolesData || []); //
                const bloodTypesData = await userService.getBloodTypes();
                setBloodTypes(bloodTypesData || []);
            } catch (error) {
                toast.error("Lỗi khi tải dữ liệu Roles hoặc Blood Types: " + error.message);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = "Tên đăng nhập không được để trống.";
        else if (formData.username.length < 3) newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự.";
        if (!formData.email.trim()) newErrors.email = "Email không được để trống.";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ.";
        if (!formData.fullName.trim()) newErrors.fullName = "Họ tên không được để trống.";
        if (!formData.password) newErrors.password = "Mật khẩu không được để trống.";
        else if (formData.password.length < 6) newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
        if (!formData.roleName) newErrors.roleName = "Vai trò không được để trống.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Vui lòng kiểm tra lại các trường thông tin.");
            return;
        }
        setIsLoading(true);
        const toastId = toast.loading("Đang tạo người dùng...");

        const requestData = {
            ...formData,

            phone: formData.phone.trim() || null,
            bloodTypeId: formData.bloodTypeId ? parseInt(formData.bloodTypeId, 10) : null,
        };
        delete requestData.confirmPassword; // Không gửi confirmPassword lên server

        try {
            await userService.createUserByAdmin(requestData); //
            toast.success("Tạo người dùng thành công!", { id: toastId });
            navigate('/admin/users');
        } catch (error) {
            toast.error(`Lỗi khi tạo người dùng: ${error.message || 'Vui lòng thử lại.'}`, { id: toastId });
            // Kiểm tra lỗi từ server để hiển thị cụ thể hơn nếu có
            if (error.response && error.response.data && typeof error.response.data === 'object') {
                const serverErrors = {};
                for (const key in error.response.data) {
                    serverErrors[key] = error.response.data[key];
                }
                setErrors(prev => ({ ...prev, ...serverErrors }));
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && roles.length === 0) { // Chỉ hiển thị loading ban đầu
        return <div className="flex justify-center items-center h-64"><LoadingSpinner size="12" /></div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Link to="/admin/users" className="flex items-center text-red-600 hover:text-red-800 mb-4">
                <ArrowLeft size={20} className="mr-2" />
                Quay lại danh sách
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Tạo Người dùng mới</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Tên đăng nhập" id="username" name="username" value={formData.username} onChange={handleInputChange} required error={errors.username} disabled={isLoading} />
                    <InputField label="Email" id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required error={errors.email} disabled={isLoading} />
                </div>
                <InputField label="Họ và tên đầy đủ" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required error={errors.fullName} disabled={isLoading} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Mật khẩu" id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} required error={errors.password} disabled={isLoading} />
                    <InputField label="Xác nhận mật khẩu" id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} required error={errors.confirmPassword} disabled={isLoading} />
                </div>
                <InputField label="Số điện thoại (Tùy chọn)" id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} error={errors.phone} disabled={isLoading} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 mb-1">Vai trò {<span className="text-red-500">*</span>}</label>
                        <select id="roleName" name="roleName" value={formData.roleName} onChange={handleInputChange} disabled={isLoading || roles.length === 0} required
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors.roleName ? 'border-red-500' : 'border-gray-300'}`}>
                            {roles.map(role => <option key={role.name} value={role.name}>{role.name} ({role.description})</option>)}
                        </select>
                        {errors.roleName && <p className="mt-1 text-xs text-red-600">{errors.roleName}</p>}
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                        <select id="status" name="status" value={formData.status} onChange={handleInputChange} disabled={isLoading}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
                            <option value="Active">Active</option>
                            <option value="Suspended">Suspended</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="bloodTypeId" className="block text-sm font-medium text-gray-700 mb-1">Nhóm máu (Tùy chọn)</label>
                    <select
                        id="bloodTypeId"
                        name="bloodTypeId"
                        value={formData.bloodTypeId}
                        onChange={handleInputChange}
                        disabled={isLoading || bloodTypes.length === 0}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    >
                        <option value="">-- Chọn nhóm máu --</option>
                        {
                            bloodTypes
                                .filter((value, index, self) =>
                                    index === self.findIndex((t) => t.bloodGroup === value.bloodGroup)
                                )
                                .map(bt => (
                                    <option key={bt.id} value={bt.id}>{bt.bloodGroup}</option>
                                ))
                        }
                    </select>

                </div>

                <div className="flex items-center space-x-8">
                    <div className="flex items-center">
                        <input id="emailVerified" name="emailVerified" type="checkbox" checked={formData.emailVerified} onChange={handleInputChange} disabled={isLoading} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                        <label htmlFor="emailVerified" className="ml-2 block text-sm text-gray-900">Email đã xác thực</label>
                    </div>
                    <div className="flex items-center">
                        <input id="phoneVerified" name="phoneVerified" type="checkbox" checked={formData.phoneVerified} onChange={handleInputChange} disabled={isLoading} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                        <label htmlFor="phoneVerified" className="ml-2 block text-sm text-gray-900">SĐT đã xác thực</label>
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <Link to="/admin/users">
                        <Button type="button" variant="secondary" disabled={isLoading}>
                            Hủy
                        </Button>
                    </Link>
                    <Button type="submit" variant="primary" disabled={isLoading}>
                        {isLoading ? <LoadingSpinner size="5" color="white" className="mr-2" /> : <UserPlus size={18} className="mr-2" />}
                        {isLoading ? 'Đang lưu...' : 'Tạo người dùng'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AdminUserCreatePage;