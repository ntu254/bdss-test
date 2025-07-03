import React from 'react';
import { FileX, Plus } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = FileX,
  title = "Không có dữ liệu",
  description = "Chưa có dữ liệu để hiển thị.",
  action,
  actionLabel = "Thêm mới",
  onAction,
  className = ""
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
        <Icon size={96} className="mx-auto" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {description}
      </p>

      {(action || onAction) && (
        <div>
          {action || (
            <Button onClick={onAction} variant="primary">
              <Plus size={16} className="mr-2" />
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;