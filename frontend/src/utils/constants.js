// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    PROFILE: '/users/me/profile',
    UPDATE_PROFILE: '/users/me/profile',
    SEARCH_DONORS: '/users/search/donors-by-location',
  },
  ADMIN: {
    USERS: '/admin/users',
    USER_BY_ID: (id) => `/admin/users/${id}`,
  },
  BLOOD_TYPES: '/blood-types',
  BLOOD_COMPATIBILITY: '/blood-compatibility',
  BLOOD_REQUESTS: '/blood-requests',
  DONATIONS: {
    REQUEST: '/donations/request',
    HISTORY: '/donations/my-history',
    ALL_REQUESTS: '/donations/requests',
  },
  APPOINTMENTS: '/appointments',
};

// User Roles
export const USER_ROLES = {
  GUEST: 'Guest',
  MEMBER: 'Member',
  STAFF: 'Staff',
  ADMIN: 'Admin',
};

// User Status
export const USER_STATUS = {
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
  PENDING: 'Pending',
};

// Blood Groups
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Blood Component Types
export const BLOOD_COMPONENT_TYPES = {
  WHOLE_BLOOD: 'Whole Blood',
  PLASMA: 'Plasma',
  RED_BLOOD_CELLS: 'Red Blood Cells',
  PLATELETS: 'Platelets',
  WHITE_BLOOD_CELLS: 'White Blood Cells',
};

// Donation Status
export const DONATION_STATUS = {
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  REJECTED: 'REJECTED',
  APPOINTMENT_PENDING: 'APPOINTMENT_PENDING',
  APPOINTMENT_SCHEDULED: 'APPOINTMENT_SCHEDULED',
  HEALTH_CHECK_PASSED: 'HEALTH_CHECK_PASSED',
  HEALTH_CHECK_FAILED: 'HEALTH_CHECK_FAILED',
  BLOOD_COLLECTED: 'BLOOD_COLLECTED',
  TESTING_PASSED: 'TESTING_PASSED',
  TESTING_FAILED: 'TESTING_FAILED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

// Request Status
export const REQUEST_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
};

// Urgency Levels
export const URGENCY_LEVELS = {
  NORMAL: 'NORMAL',
  URGENCY: 'URGENCY',
  CRITICAL: 'CRITICAL',
};

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'Male', label: 'Nam' },
  { value: 'Female', label: 'Nữ' },
  { value: 'Other', label: 'Khác' },
];

// Form Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10,11}$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Theme Options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Status Colors
export const STATUS_COLORS = {
  [USER_STATUS.ACTIVE]: 'success',
  [USER_STATUS.SUSPENDED]: 'error',
  [USER_STATUS.PENDING]: 'warning',
  
  [DONATION_STATUS.COMPLETED]: 'success',
  [DONATION_STATUS.PENDING_APPROVAL]: 'warning',
  [DONATION_STATUS.REJECTED]: 'error',
  [DONATION_STATUS.CANCELLED]: 'error',
  
  [REQUEST_STATUS.FULFILLED]: 'success',
  [REQUEST_STATUS.PENDING]: 'warning',
  [REQUEST_STATUS.REJECTED]: 'error',
  [REQUEST_STATUS.CANCELLED]: 'error',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng thử lại.',
  UNAUTHORIZED: 'Bạn không có quyền truy cập.',
  FORBIDDEN: 'Truy cập bị từ chối.',
  NOT_FOUND: 'Không tìm thấy tài nguyên.',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ.',
  UNKNOWN_ERROR: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Đăng nhập thành công!',
  REGISTER: 'Đăng ký thành công!',
  LOGOUT: 'Đăng xuất thành công!',
  PROFILE_UPDATED: 'Cập nhật hồ sơ thành công!',
  DATA_SAVED: 'Lưu dữ liệu thành công!',
  DATA_DELETED: 'Xóa dữ liệu thành công!',
};

// Appointment Status
export const APPOINTMENT_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  MISSED: 'MISSED',
};

// Date Format Constants
export const DATE_FORMATS = {
  API_DATE: 'YYYY-MM-DD',
  DISPLAY_DATE: 'DD/MM/YYYY',
  API_DATETIME: 'YYYY-MM-DDTHH:mm:ss',
  DISPLAY_DATETIME: 'DD/MM/YYYY HH:mm',
};