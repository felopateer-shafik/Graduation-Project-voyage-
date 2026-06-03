import axiosInstance from './axiosInstance';

export const aiAPI = {
  tripPlan: (origin, destination, days, interests, customInstructions = '', departureDate = '', returnDate = '') =>
    axiosInstance.post('/ai/trip-plan', { origin, destination, days, interests, customInstructions, departureDate, returnDate })
      .then(r => r.data),

  support: (message, history = []) =>
    axiosInstance.post('/ai/support', { message, history })
      .then(r => r.data),
};
