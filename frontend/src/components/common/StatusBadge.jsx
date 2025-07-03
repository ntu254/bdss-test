import React from 'react';
import { Badge } from '../ui/Badge';
import { STATUS_COLORS, USER_STATUS, DONATION_STATUS, REQUEST_STATUS } from '../../utils/constants';

const StatusBadge = ({ status, type = 'user', className, ...props }) => {
  const getStatusText = (status, type) => {
    switch (type) {
      case 'user':
        switch (status) {
          case USER_STATUS.ACTIVE: return 'Hoạt động';
          case USER_STATUS.SUSPENDED: return 'Tạm khóa';
          case USER_STATUS.PENDING: return 'Chờ duyệt';
          default: return status;
        }
      
      case 'donation':
        switch (status) {
          case DONATION_STATUS.PENDING_APPROVAL: return 'Chờ duyệt';
          case DONATION_STATUS.REJECTED: return 'Từ chối';
          case DONATION_STATUS.APPOINTMENT_PENDING: return 'Chờ lịch hẹn';
          case DONATION_STATUS.APPOINTMENT_SCHEDULED: return 'Đã lên lịch';
          case DONATION_STATUS.HEALTH_CHECK_PASSED: return 'Khám đạt';
          case DONATION_STATUS.HEALTH_CHECK_FAILED: return 'Khám không đạt';
          case DONATION_STATUS.BLOOD_COLLECTED: return 'Đã lấy máu';
          case DONATION_STATUS.TESTING_PASSED: return 'Xét nghiệm đạt';
          case DONATION_STATUS.TESTING_FAILED: return 'Xét nghiệm không đạt';
          case DONATION_STATUS.COMPLETED: return 'Hoàn thành';
          case DONATION_STATUS.CANCELLED: return 'Đã hủy';
          default: return status;
        }
      
      case 'request':
        switch (status) {
          case REQUEST_STATUS.PENDING: return 'Chờ xử lý';
          case REQUEST_STATUS.APPROVED: return 'Đã duyệt';
          case REQUEST_STATUS.FULFILLED: return 'Đã hoàn thành';
          case REQUEST_STATUS.REJECTED: return 'Từ chối';
          case REQUEST_STATUS.CANCELLED: return 'Đã hủy';
          default: return status;
        }
      
      default:
        return status;
    }
  };

  const variant = STATUS_COLORS[status] || 'default';
  const text = getStatusText(status, type);

  return (
    <Badge variant={variant} className={className} {...props}>
      {text}
    </Badge>
  );
};

export default StatusBadge;