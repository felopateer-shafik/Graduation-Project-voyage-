import { create } from 'zustand';
import { normalizeHotelDetails } from '@/utils/bookingPricing';

const useBookingStore = create((set) => ({
  // Current booking in progress
  bookingItem: null, // flight or hotel being booked
  bookingType: null, // 'flight' | 'hotel' | 'package'
  bookingDetails: {},

  // Booking details
  passengers: [],
  paymentMethod: 'credit_card',
  currency: 'EGP',

  // Price freeze
  isPriceFrozen: false,
  frozenPrice: null,
  freezeExpiry: null,

  // Confirmation
  confirmationCode: null,
  bookingStatus: null,

  // Loading
  isProcessing: false,
  error: null,

  // Actions
  setBookingItem: (item, type, details = {}) => set({
    bookingItem: item,
    bookingType: type,
    bookingDetails: type === 'hotel' ? normalizeHotelDetails(details) : details,
    confirmationCode: null,
    bookingStatus: null,
  }),

  setBookingDetails: (details) => set((state) => ({
    bookingDetails: state.bookingType === 'hotel'
      ? normalizeHotelDetails({ ...state.bookingDetails, ...details })
      : { ...state.bookingDetails, ...details },
  })),

  setPassengers: (passengers) => set({ passengers }),

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  setCurrency: (currency) => set({ currency }),

  freezePrice: (price, expiry) => set({
    isPriceFrozen: true,
    frozenPrice: price,
    freezeExpiry: expiry,
  }),

  setConfirmation: (code, status) => set({
    confirmationCode: code,
    bookingStatus: status,
    isProcessing: false,
  }),

  setProcessing: (isProcessing) => set({ isProcessing }),

  setError: (error) => set({ error, isProcessing: false }),

  clearBooking: () => set({
    bookingItem: null,
    bookingType: null,
    bookingDetails: {},
    passengers: [],
    paymentMethod: 'credit_card',
    isPriceFrozen: false,
    frozenPrice: null,
    freezeExpiry: null,
    confirmationCode: null,
    bookingStatus: null,
    isProcessing: false,
    error: null,
  }),
}));

export default useBookingStore;
