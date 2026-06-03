import axiosInstance from './axiosInstance';

export const recommendationsAPI = {
  async get() {
    const { data } = await axiosInstance.get('/recommendations');
    return data;
  },
};
