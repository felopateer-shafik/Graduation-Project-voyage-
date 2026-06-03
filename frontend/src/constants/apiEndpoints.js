/** API endpoint constants — aligned with Spring Boot backend */
export const API = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_OTP: '/auth/verify-otp',
    RESEND_OTP: '/auth/resend-otp',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout',
    UPLOAD_AVATAR: '/auth/profile/picture',
    DELETE_AVATAR: '/auth/profile/picture',
  },
  FLIGHTS: {
    LIST: '/flights',
    SEARCH: '/flights/search',
    DETAIL: (id) => `/flights/${id}`,
  },
  HOTELS: {
    LIST: '/hotels',
    SEARCH: '/hotels/search',
    DETAIL: (id) => `/hotels/${id}`,
  },
  TOURS: {
    LIST: '/tours',
    SEARCH: '/tours/search',
    DETAIL: (id) => `/tours/${id}`,
  },
  BOOKINGS: {
    CREATE: '/bookings/add',
    LIST: '/bookings/my-bookings',
    CANCEL_SERVICE: (serviceId) => `/bookings/services/${serviceId}/cancel`,
    CHECKOUT: (id) => `/bookings/${id}/checkout`,
    CHECKOUT_VISA: (id) => `/bookings/${id}/checkout/visa`,
    PLANNER: '/bookings/planner',
    WALLET_TOPUP: '/bookings/wallet/topup',
    FREEZE: '/bookings/freeze',
    MY_FREEZES: '/bookings/my-freezes',
  },
  WISHLIST: {
    ADD: '/wishlist/add',
    LIST: '/wishlist/my',
    REMOVE: (id) => `/wishlist/remove/${id}`,
    CLEAR: '/wishlist/clear',
  },
  PACKAGES: {
    LIST: '/packages',
    DETAIL: (id) => `/packages/${id}`,
  },
  LOYALTY: {
    BALANCE: '/loyalty/balance',
    HISTORY: '/loyalty/history',
    REDEEM: '/loyalty/redeem',
  },
  COUNTRIES: {
    LIST: '/countries',
    DETAIL: (code) => `/countries/${code}`,
  },
  CITIES: {
    LIST: '/cities',
    DETAIL: (code) => `/cities/${code}`,
  },
  LANDMARKS: {
    LIST: '/landmarks',
    DETAIL: (id) => `/landmarks/${id}`,
  },
};
