// src/components/admin/BloodCompatibilityFormModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import InputField from '../common/InputField';
import bloodCompatibilityService from '../../services/bloodCompatibilityService';
import bloodTypeService from '../../services/bloodTypeService';
import toast from 'react-hot-toast';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth'; // Import useAuth hook

const BloodCompatibilityFormModal = ({ isOpen, onClose, onSaveSuccess, rule }) => {
    const [formData, setFormData] = useState({
        donorBloodTypeId: '',
        recipientBloodTypeId: '',
        isCompatible: true,
        isEmergencyCompatible: false,
        compatibilityScore: '',
        notes: ''
    });
    const [bloodTypes, setBloodTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { user } = useAuth(); // Lấy user từ useAuth

    const fetchDropdownData = useCallback(async () => {
        setIsDataLoading(true);
        try {
            const typesData = await bloodTypeService.getAll();
            setBloodTypes(typesData || []);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách loại máu: " + error.message);
        } finally {
            setIsDataLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchDropdownData();
        }
    }, [isOpen, fetchDropdownData]);

    useEffect(() => {
        if (rule) {
            setFormData({
                donorBloodTypeId: rule.donorBloodType?.id || '',
                recipientBloodTypeId: rule.recipientBloodType?.id || '',
                isCompatible: rule.isCompatible,
                isEmergencyCompatible: rule.isEmergencyCompatible,
                compatibilityScore: rule.compatibilityScore || '',
                notes: rule.notes || ''
            });
        } else {
            setFormData({
                donorBloodTypeId: '',
                recipientBloodTypeId: '',
                isCompatible: true,
                isEmergencyCompatible: false,
                compatibilityScore: '100',
                notes: ''
            });
        }
        setErrors({});
    }, [rule, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.donorBloodTypeId) newErrors.donorBloodTypeId = "Vui lòng chọn loại máu người cho.";
        if (!formData.recipientBloodTypeId) newErrors.recipientBloodTypeId = "Vui lòng chọn loại máu người nhận.";
        if (formData.compatibilityScore === '' || isNaN(formData.compatibilityScore)) {
            newErrors.compatibilityScore = "Điểm tương thích phải là một số.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Kiểm tra quyền trước khi gửi form
        if (user?.role !== 'Admin') { //
            toast.error("Bạn không có quyền thực hiện thao tác này.");
            return;
        }

        if (!validateForm()) {
            toast.error("Vui lòng kiểm tra lại các trường thông tin.");
            return;
        }
        setIsLoading(true);
        const toastId = toast.loading(rule ? 'Đang cập nhật...' : 'Đang tạo...');

        const dataToSend = {
            donorBloodTypeId: parseInt(formData.donorBloodTypeId),
            recipientBloodTypeId: parseInt(formData.recipientBloodTypeId),
            isCompatible: formData.isCompatible,
            isEmergencyCompatible: formData.isEmergencyCompatible,
            compatibilityScore: parseFloat(formData.compatibilityScore),
            notes: formData.notes.trim() === '' ? null : formData.notes.trim(),
        };

        try {
            if (rule?.id) {
                await bloodCompatibilityService.update(rule.id, dataToSend);
            } else {
                await bloodCompatibilityService.create(dataToSend);
            }
            toast.success(rule ? 'Cập nhật thành công!' : 'Tạo thành công!', { id: toastId });
            onSaveSuccess();
        } catch (error) {
            toast.error(`Lỗi: ${error.message || 'Đã có lỗi xảy ra'}`, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    // Vô hiệu hóa các input và nút nếu người dùng không phải Admin
    const isReadOnly = user?.role !== 'Admin'; //

    const modalFooter = (
        <>
            <Button variant="secondary" onClick={onClose} disabled={isLoading || isDataLoading}>Hủy</Button>
            <Button variant="primary" type="submit" form="bloodCompatibilityForm" disabled={isLoading || isDataLoading || isReadOnly} isLoading={isLoading}>
                {rule ? 'Lưu thay đổi' : 'Tạo mới'}
            </Button>
        </>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={rule ? "Chỉnh sửa quy tắc" : "Thêm quy tắc tương thích"} footerContent={modalFooter} size="lg">
            {isDataLoading ? (
                <div className="flex justify-center items-center p-8"><LoadingSpinner /></div>
            ) : (
                <form id="bloodCompatibilityForm" onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="donorBloodTypeId" className="block text-sm font-medium text-gray-700 mb-1">Loại máu người cho <span className="text-red-500">*</span></label>
                            <select name="donorBloodTypeId" id="donorBloodTypeId" value={formData.donorBloodTypeId} onChange={handleChange} disabled={isLoading || isReadOnly} required
                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors.donorBloodTypeId ? 'border-red-500' : 'border-gray-300'}`}>
                                <option value="">-- Chọn loại máu --</option>

                                {bloodTypes.map(bt => <option key={bt.id} value={bt.id}>{`${bt.bloodGroup} (${bt.componentType})`}</option>)}
                            </select>
                            {errors.donorBloodTypeId && <p className="mt-1 text-xs text-red-600">{errors.donorBloodTypeId}</p>}
                        </div>
                        <div>
                            <label htmlFor="recipientBloodTypeId" className="block text-sm font-medium text-gray-700 mb-1">Loại máu người nhận <span className="text-red-500">*</span></label>
                            <select name="recipientBloodTypeId" id="recipientBloodTypeId" value={formData.recipientBloodTypeId} onChange={handleChange} disabled={isLoading || isReadOnly} required
                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors.recipientBloodTypeId ? 'border-red-500' : 'border-gray-300'}`}>
                                <option value="">-- Chọn loại máu --</option>
                                {bloodTypes.map(bt => <option key={bt.id} value={bt.id}>{`${bt.bloodGroup} (${bt.componentType})`}</option>)}
                            </select>
                            {errors.recipientBloodTypeId && <p className="mt-1 text-xs text-red-600">{errors.recipientBloodTypeId}</p>}
                        </div>
                    </div>

                    <InputField
                        label="Điểm tương thích (0-100)"
                        name="compatibilityScore"
                        type="number" step="1" min="0" max="100"
                        value={formData.compatibilityScore}
                        onChange={handleChange}
                        required
                        disabled={isLoading || isReadOnly}
                        error={errors.compatibilityScore}
                    />
                    <div className="flex items-center space-x-8 pt-2">
                        <div className="flex items-center">
                            <input id="isCompatible" name="isCompatible" type="checkbox" checked={formData.isCompatible} onChange={handleChange} disabled={isLoading || isReadOnly} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                            <label htmlFor="isCompatible" className="ml-2 block text-sm text-gray-900">Tương thích</label>
                        </div>
                        <div className="flex items-center">
                            <input id="isEmergencyCompatible" name="isEmergencyCompatible" type="checkbox" checked={formData.isEmergencyCompatible} onChange={handleChange} disabled={isLoading || isReadOnly} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                            <label htmlFor="isEmergencyCompatible" className="ml-2 block text-sm text-gray-900">Tương thích khẩn cấp</label>
                        </div>
                    </div>
                    <InputField label="Ghi chú (Tùy chọn)" name="notes" as="textarea" rows={2} value={formData.notes} onChange={handleChange} disabled={isLoading || isReadOnly} error={errors.notes} />
                </form>
            )}
        </Modal>
    );
};

export default BloodCompatibilityFormModal;