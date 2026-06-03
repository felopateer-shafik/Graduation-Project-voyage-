import axiosInstance from './axiosInstance';
import { API } from '@/constants/apiEndpoints';

export const packagesAPI = {
  /** GET /packages?origin=CAI&destination=DXB */
  async list({ origin, destination } = {}) {
    const params = {};
    if (origin) params.origin = origin;
    if (destination) params.destination = destination;
    const { data } = await axiosInstance.get(API.PACKAGES.LIST, { params });
    return Array.isArray(data) ? data : [];
  },

  /** GET /packages/{id} — returns full detail with itinerary */
  async getById(id) {
    const { data } = await axiosInstance.get(API.PACKAGES.DETAIL(id));
    return data;
  },
};
