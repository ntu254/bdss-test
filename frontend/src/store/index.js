// src/store/index.js
import { create } from 'zustand'; //

// Ví dụ một store đơn giản cho settings UI hoặc notifications
export const useUIStore = create((set) => ({
    theme: 'light', // 'light' or 'dark'
    notifications: [],
    toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    addNotification: (notification) => set((state) => ({ notifications: [...state.notifications, notification] })),
    removeNotification: (id) => set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) })),
}));

// Bạn có thể tạo nhiều store khác nhau và export từ đây
// Hoặc kết hợp các slice nếu dùng Redux Toolkit
// import userSlice from './slices/userSlice';
// import { configureStore } from '@reduxjs/toolkit';
// const store = configureStore({ reducer: { user: userSlice } });
// export default store;