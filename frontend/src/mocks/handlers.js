import { adminHandlers } from './adminHandlers';
import { authHandlers } from './authHandlers';
import { bloodCompatibilityHandlers } from './bloodCompatibilityHandlers';
import {donationHandlers} from "./donationHandlers.js";
// Gộp tất cả các handler từ các file riêng biệt vào một mảng duy nhất
export const handlers = [
    ...adminHandlers,
    ...authHandlers,
    ...bloodCompatibilityHandlers,
    ...donationHandlers,
];