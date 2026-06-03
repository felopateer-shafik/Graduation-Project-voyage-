import axiosInstance from './axiosInstance';
import { API } from '@/constants/apiEndpoints';

/**
 * Derive a time-of-day label from a datetime string or Date object.
 * Returns: "Early_Morning", "Morning", "Afternoon", "Evening", "Night"
 */
function getTimeOfDayLabel(dateTimeStr) {
  if (!dateTimeStr) return 'N/A';
  const d = new Date(dateTimeStr);
  if (isNaN(d.getTime())) return String(dateTimeStr); // fallback for non-date strings
  const hour = d.getHours();
  if (hour >= 4 && hour < 8)  return 'Early_Morning';
  if (hour >= 8 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 17) return 'Afternoon';
  if (hour >= 17 && hour < 21) return 'Evening';
  return 'Night';
}

/**
 * Compute days left until departure
 */
function computeDaysLeft(dateTimeStr) {
  if (!dateTimeStr) return null;
  const dep = new Date(dateTimeStr);
  if (isNaN(dep.getTime())) return null;
  const now = new Date();
  const diffMs = dep.getTime() - now.getTime();
  if (diffMs < 0) return 0;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Convert integer stops to text label
 */
function stopsToText(stops) {
  if (stops === 0) return 'zero';
  if (stops === 1) return 'one';
  if (stops === 2) return 'two';
  return String(stops);
}

/**
 * Format departure/arrival datetime for display
 */
function formatFlightDateTime(dateTimeStr) {
  if (!dateTimeStr) return 'N/A';
  const d = new Date(dateTimeStr);
  if (isNaN(d.getTime())) return String(dateTimeStr);
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  });
}

/**
 * Transform backend Flight object → frontend Flight shape
 * Backend: { id, airlineName, flightNumber, departureCity, departureCityCode, arrivalCity, arrivalCityCode, departureTime, arrivalTime, duration, price, availableSeats, stops, cabinClass, aircraft, imageUrl, amenities }
 * Frontend: enriched with time-of-day labels, stops text, daysLeft, formatted times
 */
export function transformFlight(backendFlight) {
  const airlineCode = backendFlight.flightNumber?.substring(0, 2) || backendFlight.airlineName?.substring(0, 2).toUpperCase() || 'XX';
  const stops = backendFlight.stops || 0;
  let stopLabel = 'Non-stop';
  if (stops === 1) {
    stopLabel = `1 Stop${backendFlight.destination ? ` (${backendFlight.destination})` : ''}`;
  } else if (stops >= 2) {
    stopLabel = `${stops} Stops`;
  }

  return {
    id: backendFlight.id,
    airline: backendFlight.airlineName,
    airlineLogo: airlineCode,
    flightNumber: backendFlight.flightNumber,
    from: {
      city: backendFlight.departureCity,
      code: backendFlight.departureCityCode || backendFlight.departureCity?.substring(0, 3).toUpperCase(),
      airport: backendFlight.departureCity,
    },
    to: {
      city: backendFlight.arrivalCity,
      code: backendFlight.arrivalCityCode || backendFlight.arrivalCity?.substring(0, 3).toUpperCase(),
      airport: backendFlight.arrivalCity,
    },
    departure: backendFlight.departureTime,
    arrival: backendFlight.arrivalTime,
    departureFormatted: formatFlightDateTime(backendFlight.departureTime),
    arrivalFormatted: formatFlightDateTime(backendFlight.arrivalTime),
    departureTimeLabel: getTimeOfDayLabel(backendFlight.departureTime),
    arrivalTimeLabel: getTimeOfDayLabel(backendFlight.arrivalTime),
    duration: backendFlight.duration || 'N/A',
    price: backendFlight.price,
    stops: stops,
    stopsText: stopsToText(stops),
    stopLabel: stopLabel,
    daysLeft: computeDaysLeft(backendFlight.departureTime),
    class: backendFlight.cabinClass || 'Economy',
    aircraft: backendFlight.aircraft || 'N/A',
    baggage: stops === 0 ? '23 kg' : '20 kg',
    imageUrl: backendFlight.imageUrl,
    availableSeats: backendFlight.availableSeats,
    seatsLeft: backendFlight.availableSeats,
    amenities: backendFlight.amenities ? backendFlight.amenities.split(',').map(a => a.trim()) : [],
    destination: backendFlight.destination,
    refundable: Boolean(backendFlight.refundable),
  };
}

export const flightsAPI = {
  async search(params) {
    const { data } = await axiosInstance.get(API.FLIGHTS.SEARCH, {
      params: { from: params.from, to: params.to },
    });
    return Array.isArray(data) ? data.map(transformFlight) : [];
  },

  async getAll() {
    const { data } = await axiosInstance.get(API.FLIGHTS.LIST);
    return Array.isArray(data) ? data.map(transformFlight) : [];
  },

  async getById(id) {
    const { data } = await axiosInstance.get(API.FLIGHTS.DETAIL(id));
    return transformFlight(data);
  },
};
