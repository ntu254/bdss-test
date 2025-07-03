import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Button from './Button'; //

// /**
//  * Component phân trang tái sử dụng.
//  * @param {object} props
//  * @param {number} props.currentPage - Trang hiện tại (bắt đầu từ 0).
//  * @param {number} props.totalPages - Tổng số trang.
//  * @param {function(number): void} props.onPageChange - Callback khi trang thay đổi.
//  * @param {boolean} [props.isLoading=false] - Trạng thái loading để vô hiệu hóa nút.
//  * @param {number} [props.maxVisiblePages=5] - Số lượng trang tối đa hiển thị cùng lúc.
//  */
const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    isLoading = false,
    maxVisiblePages = 5
}) => {
    if (totalPages <= 1) {
        return null; // Không hiển thị phân trang nếu chỉ có 1 trang hoặc ít hơn
    }

    const getPageNumbers = () => {
        const pageNumbers = [];
        if (totalPages <= maxVisiblePages) {
            // Hiển thị tất cả các trang nếu tổng số trang nhỏ hơn hoặc bằng max
            for (let i = 0; i < totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Logic hiển thị ... khi có nhiều trang
            let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

            if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = endPage - maxVisiblePages + 1;
            }

            startPage = Math.max(0, startPage);

            if (startPage > 0) {
                pageNumbers.push(0);
                if (startPage > 1) {
                    pageNumbers.push('...');
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (endPage < totalPages - 1) {
                if (endPage < totalPages - 2) {
                    pageNumbers.push('...');
                }
                pageNumbers.push(totalPages - 1);
            }
        }
        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();
    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage === totalPages - 1;

    return (
        <div className="flex items-center space-x-1">
            <Button
                onClick={() => onPageChange(0)}
                disabled={isFirstPage || isLoading}
                variant="outline"
                className="p-2"
                title="Trang đầu"
            >
                <ChevronsLeft size={18} />
            </Button>
            <Button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={isFirstPage || isLoading}
                variant="outline"
                className="p-2"
                title="Trang trước"
            >
                <ChevronLeft size={18} />
            </Button>

            {pageNumbers.map((pageNumber, index) =>
                typeof pageNumber === 'number' ? (
                    <Button
                        key={pageNumber}
                        onClick={() => onPageChange(pageNumber)}
                        disabled={isLoading}
                        variant={currentPage === pageNumber ? 'primary' : 'outline'}
                        className="p-2 min-w-[36px]"
                    >
                        {pageNumber + 1}
                    </Button>
                ) : (
                    <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                        ...
                    </span>
                )
            )}

            <Button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={isLastPage || isLoading}
                variant="outline"
                className="p-2"
                title="Trang sau"
            >
                <ChevronRight size={18} />
            </Button>
            <Button
                onClick={() => onPageChange(totalPages - 1)}
                disabled={isLastPage || isLoading}
                variant="outline"
                className="p-2"
                title="Trang cuối"
            >
                <ChevronsRight size={18} />
            </Button>
        </div>
    );
};

export default Pagination;