import axiosInstance from './axiosInstance';
import { API } from '@/constants/apiEndpoints';

export const toursAPI = {
  async getAll() {
    const { data } = await axiosInstance.get(API.TOURS.LIST);
    return data;
  },

  async getById(id) {
    const { data } = await axiosInstance.get(API.TOURS.DETAIL(id));
    return data;
  },

  async search(query) {
    const { data } = await axiosInstance.get(API.TOURS.SEARCH, { params: { query } });
    return data;
  },

  async getFeatured() {
    const { data } = await axiosInstance.get(`${API.TOURS.LIST}/featured`);
    return data;
  },

  async getByCategory(category) {
    const { data } = await axiosInstance.get(`${API.TOURS.LIST}/category/${category}`);
    return data;
  },
};
