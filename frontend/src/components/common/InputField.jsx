import React from 'react';

// /**
//  * Component trường nhập liệu (input field) có label, lỗi và icon.
//  * @param {object} props
//  * @param {string} props.id - ID của input, dùng cho label 'htmlFor'.
//  * @param {string} props.name - Tên của input, dùng cho state quản lý form.
//  * @param {string} [props.type='text'] - Loại của input (text, password, email, number, date...).
//  * @param {string} props.label - Nhãn hiển thị phía trên input.
//  * @param {string | number} props.value - Giá trị của input.
//  * @param {(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} props.onChange - Hàm xử lý khi giá trị thay đổi.
//  * @param {string} [props.placeholder] - Placeholder của input.
//  * @param {boolean} [props.required=false] - Input có bắt buộc nhập hay không.
//  * @param {boolean} [props.disabled=false] - Trạng thái vô hiệu hóa.
//  * @param {string} [props.error] - Chuỗi lỗi để hiển thị bên dưới input.
//  * @param {string} [props.className=''] - Class CSS tùy chỉnh cho container.
//  * @param {boolean} [props.hasIcon=false] - Có icon bên trong input hay không.
//  * @param {React.ReactNode} [props.icon] - Component icon để hiển thị.
//  * @param {() => void} [props.onIconClick] - Hàm xử lý khi click vào icon.
//  * @param {'textarea'} [props.as] - Render component như là 'textarea'.
//  * @param {number} [props.rows] - Số dòng cho textarea.
//  */
const InputField = ({
    id,
    name,
    type = 'text',
    label,
    value,
    onChange,
    placeholder,
    required = false,
    disabled = false,
    error,
    className = '',
    hasIcon = false,
    icon,
    onIconClick,
    as,
    rows,
    ...props
}) => {
    const baseInputStyle =
        'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm';
    const errorInputStyle = 'border-red-500';
    const normalInputStyle = 'border-gray-300';

    const InputComponent = as === 'textarea' ? 'textarea' : 'input';

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label htmlFor={id || name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                <InputComponent
                    type={type}
                    id={id || name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    rows={rows}
                    className={`${baseInputStyle} ${error ? errorInputStyle : normalInputStyle} ${hasIcon ? 'pr-10' : ''}`}
                    {...props}
                />
                {hasIcon && icon && (
                    <div
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                        onClick={onIconClick}
                    >
                        {icon}
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
};

export default InputField;