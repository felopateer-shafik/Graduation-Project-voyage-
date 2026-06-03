import axiosInstance from './axiosInstance';
import { API } from '@/constants/apiEndpoints';

/**
 * Transform backend Hotel object → frontend Hotel shape
 * Backend: { id, name, city, location, description, pricePerNight, rating, reviewCount, imageUrl, images, availableRooms, roomType, amenities, latitude, longitude, stars }
 * Frontend: { id, name, city, location, description, pricePerNight, rating, reviews, images[], roomType, amenities[], coordinates }
 */
export function transformHotel(backendHotel) {
  return {
    id: backendHotel.id,
    name: backendHotel.name,
    city: backendHotel.city,
    location: backendHotel.location || backendHotel.city,
    description: backendHotel.description,
    pricePerNight: backendHotel.pricePerNight,
    rating: backendHotel.rating,
    reviews: backendHotel.reviewCount || 0,
    reviewCount: backendHotel.reviewCount || 0,
    stars: backendHotel.stars || Math.round(backendHotel.rating),
    imageUrl: backendHotel.imageUrl,
    images: backendHotel.images
      ? backendHotel.images.split(',').map(url => url.trim())
      : backendHotel.imageUrl
        ? [backendHotel.imageUrl]
        : [],
    availableRooms: backendHotel.availableRooms,
    roomType: backendHotel.roomType || 'Standard',
    amenities: backendHotel.amenities ? backendHotel.amenities.split(',').map(a => a.trim()) : [],
    coordinates: backendHotel.latitude && backendHotel.longitude
      ? { lat: backendHotel.latitude, lng: backendHotel.longitude }
      : null,
  };
}

export const hotelsAPI = {
  async search(params) {
    const { data } = await axiosInstance.get(API.HOTELS.SEARCH, {
      params: { city: params.city || params.to, maxPrice: params.maxPrice },
    });
    return Array.isArray(data) ? data.map(transformHotel) : [];
  },

  async getAll() {
    const { data } = await axiosInstance.get(API.HOTELS.LIST);
    return Array.isArray(data) ? data.map(transformHotel) : [];
  },

  async getById(id) {
    const { data } = await axiosInstance.get(API.HOTELS.DETAIL(id));
    return transformHotel(data);
  },
};
