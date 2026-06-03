import { beforeEach, describe, expect, it, vi } from 'vitest';
import axiosInstance from './axiosInstance';
import { authAPI } from './auth';
import { API } from '@/constants/apiEndpoints';

vi.mock('./axiosInstance', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('authAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('preserves phone when registering', async () => {
    axiosInstance.post.mockResolvedValueOnce({ data: { message: 'ok', email: 'ali@example.com' } });

    await authAPI.register({
      fullName: 'Ali Shams',
      email: 'ali@example.com',
      password: 'password123',
      phone: '+201001234567',
    });

    expect(axiosInstance.post).toHaveBeenCalledWith(API.AUTH.REGISTER, {
      fullName: 'Ali Shams',
      email: 'ali@example.com',
      password: 'password123',
      phone: '+201001234567',
    });
  });

  it('uses the dedicated OTP resend endpoint', async () => {
    axiosInstance.post.mockResolvedValueOnce({ data: { message: 'sent', email: 'ali@example.com' } });

    await authAPI.resendOtp({ email: 'ali@example.com' });

    expect(axiosInstance.post).toHaveBeenCalledWith(API.AUTH.RESEND_OTP, {
      email: 'ali@example.com',
    });
  });
});

