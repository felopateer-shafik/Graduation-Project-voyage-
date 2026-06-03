import axiosInstance from './axiosInstance';

export const reviewsAPI = {
  /** GET /reviews?targetType=HOTEL&targetId=12 */
  async list(targetType, targetId) {
    const { data } = await axiosInstance.get('/reviews', {
      params: { targetType, targetId },
    });
    return data;
  },

  /** POST /reviews */
  async create(payload) {
    const { data } = await axiosInstance.post('/reviews', payload);
    return data;
  },

  /** DELETE /reviews/{id} */
  async remove(id) {
    await axiosInstance.delete(`/reviews/${id}`);
  },
};
