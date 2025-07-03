import React from 'react';

// /**
//  * Component hiển thị một vòng xoay SVG để chỉ báo trạng thái đang tải.
//  * @param {object} props
//  * @param {'4' | '5' | '6' | '8' | '10' | '12'} [props.size='8'] - Kích thước của spinner, tương ứng với class `h-{size}` và `w-{size}` của Tailwind.
//  * @param {string} [props.color='red-600'] - Màu của spinner, tương ứng với class `text-{color}` của Tailwind.
//  * @param {string} [props.className=''] - Class CSS tùy chỉnh thêm cho container.
//  */
const LoadingSpinner = ({ size = '8', color = 'red-600', className = '' }) => {
    return (
        <div className={`flex justify-center items-center ${className}`}>
            <svg
                className={`animate-spin h-${size} w-${size} text-${color}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                role="status" 
                aria-label="Loading"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
        </div>
    );
};

export default LoadingSpinner;