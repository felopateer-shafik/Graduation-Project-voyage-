import axiosInstance from './axiosInstance';
import { API } from '@/constants/apiEndpoints';

export const countriesAPI = {
  /** GET /countries?popular=true */
  async list(popularOnly = false) {
    const { data } = await axiosInstance.get(API.COUNTRIES.LIST, {
      params: popularOnly ? { popular: true } : {},
    });
    return data;
  },

  /** GET /countries/{code} — returns country with cities list */
  async getByCode(code) {
    const { data } = await axiosInstance.get(API.COUNTRIES.DETAIL(code));
    return data;
  },
};
