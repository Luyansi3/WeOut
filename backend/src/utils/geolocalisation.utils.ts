const EARTH_RADIUS_KM = 6371;

const haversineFormula = (lat: number, lng: number, latCol = 'latitude', lngCol = 'longitude') => {
  return `(${EARTH_RADIUS_KM} * acos(cos(radians(${lat})) * cos(radians(${latCol})) * cos(radians(${lngCol}) - radians(${lng})) + sin(radians(${lat})) * sin(radians(${latCol}))))`;
};
