import axiosInstance from './axiosInstance';
import { API } from '@/constants/apiEndpoints';

export const authAPI = {
    /**
     * تسجيل الدخول التقليدي (بريد وكلمة سر)
     */
    async login(credentials) {
        const { data } = await axiosInstance.post(API.AUTH.LOGIN, credentials);
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        return data;
    },

    /**
     * تسجيل الدخول بواسطة جوجل
     */
    async googleLogin(idToken) {
        const { data } = await axiosInstance.post('/auth/login/google', {
            token: idToken
        });

        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        return data;
    },

    /**
     * إنشاء حساب جديد
     */
    async register(userData) {
        const payload = {
            fullName: userData.fullName || "New User",
            email: userData.email ? userData.email.toLowerCase().trim() : "",
            password: userData.password,
            phone: userData.phone || ""
        };
        const { data } = await axiosInstance.post(API.AUTH.REGISTER, payload);
        return data;
    },

    /**
     * التحقق من كود الـ OTP بعد التسجيل
     */
    async verifyOtp(otpData) {
        const { data } = await axiosInstance.post(API.AUTH.VERIFY_OTP, otpData);
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        return data;
    },

    /**
     * جلب بيانات المستخدم المسجل حالياً
     */
    async getMe() {
        const { data } = await axiosInstance.get(API.AUTH.ME);
        return data;
    },

    /**
     * Update profile (name, phone)
     */
    async updateProfile({ fullName, phone }) {
        const { data } = await axiosInstance.put(API.AUTH.PROFILE, { fullName, phone });
        return data;
    },

    /**
     * Upload profile picture (multipart)
     */
    async uploadAvatar(file) {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await axiosInstance.post(API.AUTH.UPLOAD_AVATAR, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },

    /**
     * Delete profile picture
     */
    async deleteAvatar() {
        const { data } = await axiosInstance.delete(API.AUTH.DELETE_AVATAR);
        return data;
    },

    /**
     * تسجيل الخروج ومسح بيانات الجلسة
     */
    async logout() {
        localStorage.removeItem('token');
        return { message: 'Logged out successfully' };
    }
};