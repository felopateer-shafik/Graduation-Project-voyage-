const toPositiveInt = (value, fallback = 1) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export function normalizeHotelDetails(details = {}) {
  return {
    rooms: toPositiveInt(details.rooms, 1),
    days: toPositiveInt(details.days, 1),
    guests: toPositiveInt(details.guests, 1),
  };
}

export function getPaidPackagePrice(item = {}) {
  return item.totalPrice ?? item.price ?? item.pricePerPerson ?? 0;
}

export function calculateBookingEstimate({ type, item = {}, details = {} }) {
  if (type === 'hotel') {
    const hotelDetails = normalizeHotelDetails(details);
    const unitPrice = item.pricePerNight ?? item.price ?? 0;
    return {
      unitPrice,
      total: unitPrice * hotelDetails.rooms * hotelDetails.days,
      quantityLabel: `${hotelDetails.rooms} room${hotelDetails.rooms > 1 ? 's' : ''} x ${hotelDetails.days} day${hotelDetails.days > 1 ? 's' : ''}`,
      details: hotelDetails,
    };
  }

  if (type === 'package') {
    const unitPrice = getPaidPackagePrice(item);
    return {
      unitPrice,
      total: unitPrice,
      quantityLabel: 'Bundle',
      details: {},
    };
  }

  if (type === 'tour') {
    const unitPrice = item.price ?? item.pricePerPerson ?? 0;
    return {
      unitPrice,
      total: unitPrice,
      quantityLabel: 'Tour',
      details: {},
    };
  }

  const unitPrice = item.price ?? 0;
  return {
    unitPrice,
    total: unitPrice,
    quantityLabel: 'Flight',
    details: {},
  };
}
