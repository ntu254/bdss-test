// src/components/admin/BloodTypeFormModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import InputField from '../common/InputField';
import bloodTypeService from '../../services/bloodTypeService';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth'; // Import useAuth hook

const componentTypeOptions = [
    "Whole Blood",
    "Plasma",
    "Red Blood Cells",
    "Platelets",
    "White Blood Cells"
];

const BloodTypeFormModal = ({ isOpen, onClose, onSaveSuccess, bloodType }) => {
    const [formData, setFormData] = useState({
        bloodGroup: '',
        componentType: 'Whole Blood',
        description: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { user } = useAuth(); // Lấy user từ useAuth

    useEffect(() => {
        if (bloodType) {
            setFormData({
                bloodGroup: bloodType.bloodGroup || '',
                componentType: bloodType.componentType || 'Whole Blood',
                description: bloodType.description || '',
            });
        } else {
            setFormData({
                bloodGroup: '',
                componentType: '',
                description: '',
            });
        }
        setErrors({});
    }, [bloodType, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.bloodGroup.trim()) newErrors.bloodGroup = "Nhóm máu không được trống.";
        if (!formData.componentType) newErrors.componentType = "Thành phần máu không được trống.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // First check permissions
        if (user?.role !== 'Admin') {
            toast.error("Bạn không có quyền thực hiện thao tác này.");
            return;
        }

        // Then validate the form
        if (!validateForm()) {
            toast.error("Vui lòng kiểm tra lại thông tin.");
            return;
        }
        
        // Prepare data after validation passes
        const dataToSend = {
            ...formData,
            description: formData.description.trim() === '' ? null : formData.description.trim(),
        };
        
        // Start loading and submit data
        setIsLoading(true);
        const toastId = toast.loading(bloodType ? 'Đang cập nhật...' : 'Đang tạo...');

        try {
            if (bloodType?.id) {
                const updateRequestData = {
                    description: dataToSend.description,
                };
                await bloodTypeService.update(bloodType.id, updateRequestData);
            } else {
                await bloodTypeService.create(dataToSend);
            }
            toast.success(bloodType ? 'Cập nhật thành công!' : 'Tạo thành công!', { id: toastId });
            onSaveSuccess();
        } catch (error) {
            toast.error(`Lỗi: ${error.message || 'Đã có lỗi xảy ra.'}`, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    // Vô hiệu hóa các input và nút nếu người dùng không phải Admin
    const isReadOnly = user?.role !== 'Admin'; //
    const isEditMode = !!bloodType;

    const modalFooter = (
        <>
            <Button variant="secondary" onClick={onClose} disabled={isLoading}>Hủy</Button>
            <Button variant="primary" type="submit" form="bloodTypeForm" disabled={isLoading || isReadOnly} isLoading={isLoading}>
                {bloodType ? 'Lưu thay đổi' : 'Tạo mới'}
            </Button>
        </>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Chỉnh sửa loại máu" : "Thêm loại máu mới"} footerContent={modalFooter} size="lg">
            <form id="bloodTypeForm" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Nhóm máu (A+, O-, ..)"
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        required
                        disabled={isLoading || isEditMode || isReadOnly}
                        error={errors.bloodGroup}
                    />

                    <div>
                        <label htmlFor="componentType" className="block text-sm font-medium text-gray-700 mb-1">Thành phần máu</label>
                        <select
                            id="componentType"
                            name="componentType"
                            value={formData.componentType}
                            onChange={handleChange}
                            disabled={isLoading || isEditMode || isReadOnly}
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors.componentType ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            {componentTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        {errors.componentType && <p className="mt-1 text-xs text-red-600">{errors.componentType}</p>}
                    </div>
                </div>

                <InputField
                    label="Mô tả (Tùy chọn)"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={isLoading || isReadOnly}
                    error={errors.description}
                />
            </form>
        </Modal>
    );
};

export default BloodTypeFormModal;