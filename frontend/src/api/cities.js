import axiosInstance from './axiosInstance';
import { API } from '@/constants/apiEndpoints';

export const citiesAPI = {
  /** GET /cities?countryCode=EG */
  async list(countryCode) {
    const params = countryCode ? { countryCode } : {};
    const { data } = await axiosInstance.get(API.CITIES.LIST, { params });
    return data;
  },

  /** GET /cities/{code} — returns city with landmarks + activities */
  async getByCode(code) {
    const { data } = await axiosInstance.get(API.CITIES.DETAIL(code));
    return data;
  },

  /** GET /landmarks?cityCode=CAI&hiddenGem=true */
  async getLandmarks({ cityCode, hiddenGem } = {}) {
    const params = {};
    if (cityCode) params.cityCode = cityCode;
    if (hiddenGem !== undefined) params.hiddenGem = hiddenGem;
    const { data } = await axiosInstance.get(API.LANDMARKS.LIST, { params });
    return data;
  },

  /** GET /landmarks/{id} */
  async getLandmarkById(id) {
    const { data } = await axiosInstance.get(API.LANDMARKS.DETAIL(id));
    return data;
  },
};
