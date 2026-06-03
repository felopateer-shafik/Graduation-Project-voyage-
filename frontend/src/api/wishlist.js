import axiosInstance from './axiosInstance';
import { API } from '@/constants/apiEndpoints';

export const wishlistAPI = {
  /**
   * Add item to wishlist
   * @param {{ type: string, itemId: number }} item
   */
  async add(item) {
    const { data } = await axiosInstance.post(API.WISHLIST.ADD, item);
    return data;
  },

  /**
   * Get current user's wishlist
   */
  async list() {
    const { data } = await axiosInstance.get(API.WISHLIST.LIST);
    return data;
  },

  /**
   * Remove item from wishlist
   * @param {number} id - Wishlist item ID
   */
  async remove(id) {
    const { data } = await axiosInstance.delete(API.WISHLIST.REMOVE(id));
    return data;
  },

  /**
   * Clear the current user's wishlist on the backend.
   */
  async clear() {
    const { data } = await axiosInstance.delete(API.WISHLIST.CLEAR);
    return data;
  },
};
