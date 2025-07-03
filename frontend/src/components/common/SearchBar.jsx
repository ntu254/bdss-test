import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

// /**
//  * Component thanh tìm kiếm có chức năng debounce.
//  * @param {object} props
//  * @param {function(string): void} props.onSearch - Callback được gọi với giá trị tìm kiếm sau khi debounce.
//  * @param {number} [props.debounceDelay=500] - Thời gian chờ (ms) trước khi trigger onSearch.
//  * @param {string} [props.placeholder='Tìm kiếm...'] - Placeholder cho input.
//  * @param {string} [props.className=''] - Class CSS tùy chỉnh cho container.
//  */

const SearchBar = ({
    onSearch,
    debounceDelay = 500,
    placeholder = 'Tìm kiếm...',
    className = ''
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            onSearch(searchTerm);
        }, debounceDelay);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [searchTerm, debounceDelay, onSearch]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearSearch = () => {
        setSearchTerm('');
        onSearch(''); 
    };

    return (
        <div className={`relative w-full max-w-sm ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
            {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                        onClick={clearSearch}
                        className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none rounded-full hover:bg-gray-100"
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchBar;