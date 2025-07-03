import React from 'react';
import { X } from 'lucide-react';

// /**
//  * Component Modal (popup/dialog) có thể tùy chỉnh.
//  * @param {object} props
//  * @param {boolean} props.isOpen - Trạng thái mở hoặc đóng của modal.
//  * @param {() => void} props.onClose - Hàm được gọi khi người dùng muốn đóng modal (click nút X hoặc overlay).
//  * @param {string} props.title - Tiêu đề của modal.
//  * @param {React.ReactNode} props.children - Nội dung chính của modal.
//  * @param {React.ReactNode} [props.footerContent] - Nội dung cho phần footer (thường là các nút bấm).
//  * @param {'sm' | 'md' | 'lg' | 'xl' | '2xl'} [props.size='md'] - Kích thước chiều rộng của modal.
//  */
const Modal = ({ isOpen, onClose, title, children, footerContent, size = 'md' }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    };

    return (
        <div
            className="fixed inset-0 z-[100] overflow-y-auto bg-gray-600 bg-opacity-50 transition-opacity"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
            onClick={onClose} // Đóng modal khi click vào overlay
        >
            <div className="flex items-center justify-center min-h-screen p-4 text-center">
                {/* Panel của Modal */}
                <div
                    className={`relative inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full ${sizeClasses[size]} animate-modal-appear`}
                    onClick={(e) => e.stopPropagation()} // Ngăn việc click bên trong modal gây đóng modal
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b">
                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                            {title}
                        </h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none rounded-full hover:bg-gray-100"
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 sm:p-6">
                        {children}
                    </div>

                    {/* Footer */}
                    {footerContent && (
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 flex flex-row-reverse space-x-2 space-x-reverse">
                            {footerContent}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;