const EARTH_RADIUS_KM = 6371; // rayon moyen de la Terre
const MAX_KM = 15;            // au‑delà de 15 km, locationScore = 0

/**
 * Distance haversine en km entre deux points.
 */
const haversineKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRad = (x: number) => (x * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const calculateCompatibility = (
  latitudeSoiree: number,
  longitudeSoiree: number,
  alcoholSoiree: number,  
  dancingSoiree: number,  
  talkingSoiree: number,  
  nbFriendsSoiree: number,
  latitudeUser: number,
  longitudeUser: number,
  alcoholUser: number,    
  dancingUser: number,    
  talkingUser: number     
): number => {
  // ---- 1) Vibe -------------------------------------------------------
  const clamp = (v: number) => Math.max(0, Math.min(100, v));

  const dA = clamp(alcoholSoiree) - clamp(alcoholUser);
  const dD = clamp(dancingSoiree) - clamp(dancingUser);
  const dT = clamp(talkingSoiree) - clamp(talkingUser);

  const distVibe = Math.sqrt(dA ** 2 + dD ** 2 + dT ** 2);
  const MAX_VIBE_DIST = Math.sqrt(3 * 100 ** 2);
  const vibeScore = 1 - distVibe / MAX_VIBE_DIST; 

  const friendBonus = Math.min(nbFriendsSoiree, 10) / 10;

  const km = haversineKm(latitudeSoiree, longitudeSoiree, latitudeUser, longitudeUser);
  const locationScore = km >= MAX_KM ? 0 : 1 - km / MAX_KM; 
  const final =
    0.6 * vibeScore +
    0.2 * friendBonus +
    0.2 * locationScore;

  return Math.round(final * 100);
};
