// src/hooks/useForm.js
import { useState, useCallback } from 'react';

// Hook cơ bản để quản lý state và validation của form
const useForm = (initialState = {}, validate = () => ({})) => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback((event) => {
        const { name, value, type, checked } = event.target;
        setValues(prevValues => ({
            ...prevValues,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
        }
    }, [errors]);

    const handleSubmit = useCallback((callback) => async (event) => {
        if (event) event.preventDefault();
        const validationErrors = validate(values);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            setIsSubmitting(true);
            await callback(values);
            setIsSubmitting(false);
        }
    }, [values, validate]);

    const resetForm = useCallback(() => {
        setValues(initialState);
        setErrors({});
        setIsSubmitting(false);
    }, [initialState]);

    return {
        values,
        setValues, // Cho phép set value từ bên ngoài nếu cần (ví dụ khi fetch data cho form edit)
        errors,
        setErrors,
        isSubmitting,
        handleChange,
        handleSubmit,
        resetForm,
    };
};

export default useForm;