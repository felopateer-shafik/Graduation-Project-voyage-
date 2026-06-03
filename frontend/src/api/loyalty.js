import axiosInstance from './axiosInstance';
import { API } from '@/constants/apiEndpoints';

export const loyaltyAPI = {
  /** GET /loyalty/balance */
  async getBalance() {
    const { data } = await axiosInstance.get(API.LOYALTY.BALANCE);
    return data;
  },

  /** GET /loyalty/history */
  async getHistory() {
    const { data } = await axiosInstance.get(API.LOYALTY.HISTORY);
    return data;
  },

  /** POST /loyalty/redeem — points must be >= 500 and a multiple of 100 */
  async redeem(points) {
    const { data } = await axiosInstance.post(API.LOYALTY.REDEEM, { points });
    return data;
  },
};
