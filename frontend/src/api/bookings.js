import axiosInstance from './axiosInstance';
import { API } from '@/constants/apiEndpoints';

export const bookingsAPI = {
  /**
   * Create a booking
   * Backend expects: { hotelId: Long, flightId: Long, tourId: Long }
   */
  async create(data) {
    const bookingRequest = {};
    if ((data.type === 'hotel') && (data.item?.id || data.hotelId)) {
      bookingRequest.hotelId = data.item?.id || data.hotelId;
      bookingRequest.rooms = data.rooms;
      bookingRequest.days = data.days;
      bookingRequest.guests = data.guests;
    }
    if ((data.type === 'flight') && (data.item?.id || data.flightId)) {
      bookingRequest.flightId = data.item?.id || data.flightId;
    }
    if (data.type === 'tour' && (data.item?.id || data.tourId)) {
      bookingRequest.tourId = data.item?.id || data.tourId;
    }
    if (data.type === 'package' && (data.item?.id || data.packageId)) {
      bookingRequest.packageId = data.item?.id || data.packageId;
    }

    const { data: result } = await axiosInstance.post(API.BOOKINGS.CREATE, bookingRequest);
    return result;
  },

  /**
   * List current user's bookings
   */
  async list() {
    const { data } = await axiosInstance.get(API.BOOKINGS.LIST);
    return data;
  },

  /**
   * Cancel a specific service from a booking
   * @param {number} serviceId - The hotel or flight ID
   * @param {string} serviceType - "HOTEL" or "FLIGHT"
   */
  async cancelService(serviceId, serviceType) {
    const { data } = await axiosInstance.put(
      API.BOOKINGS.CANCEL_SERVICE(serviceId),
      null,
      { params: { type: serviceType } }
    );
    return data;
  },

  /**
   * Checkout/pay for a booking (wallet method)
   * @param {number} bookingId
   * @param {string} method - "WALLET"
   */
  async checkout(bookingId, method) {
    const { data } = await axiosInstance.post(
      API.BOOKINGS.CHECKOUT(bookingId),
      null,
      { params: { method } }
    );
    return data;
  },

  /**
   * Checkout/pay for a booking with Visa card
   * @param {number} bookingId
   * @param {{ cardNumber, expiryDate, cvv, cardHolderName }} paymentDetails
   */
  async checkoutVisa(bookingId, paymentDetails) {
    const { data } = await axiosInstance.put(
      API.BOOKINGS.CHECKOUT_VISA(bookingId),
      paymentDetails
    );
    return data;
  },

  /**
   * Get smart planner / itinerary
   */
  async getPlanner() {
    const { data } = await axiosInstance.get(API.BOOKINGS.PLANNER);
    return data;
  },

  /**
   * Top up wallet balance
   * @param {number} amount
   */
  async topUpWallet(amount) {
    const { data } = await axiosInstance.put(
      API.BOOKINGS.WALLET_TOPUP,
      null,
      { params: { amount } }
    );
    return data;
  },

  /**
   * Freeze the price for a booking
   * Backend expects: { hotelId: Long, flightId: Long, tourId: Long }
   */
  async freezePrice(data) {
    const bookingRequest = {};
    if ((data.type === 'hotel') && (data.item?.id || data.hotelId)) {
      bookingRequest.hotelId = data.item?.id || data.hotelId;
    }
    if ((data.type === 'flight') && (data.item?.id || data.flightId)) {
      bookingRequest.flightId = data.item?.id || data.flightId;
    }
    if (data.type === 'tour' && (data.item?.id || data.tourId)) {
      bookingRequest.tourId = data.item?.id || data.tourId;
    }
    if (data.type === 'package' && (data.item?.id || data.packageId)) {
      bookingRequest.packageId = data.item?.id || data.packageId;
    }
    if (data.paymentMethod) {
      bookingRequest.paymentMethod = data.paymentMethod;
    }
    if (data.paymentDetails) {
      bookingRequest.paymentDetails = data.paymentDetails;
    }

    const { data: result } = await axiosInstance.post(API.BOOKINGS.FREEZE, bookingRequest);
    return result;
  },

  /**
   * List active price freezes for current user
   */
  async listFreezes() {
    const { data } = await axiosInstance.get(API.BOOKINGS.MY_FREEZES);
    return data;
  },
};
