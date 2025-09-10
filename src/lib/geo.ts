// src/lib/geo.ts
export function toRadians(deg: number) {
  return (deg * Math.PI) / 180;
}

export function haversineMiles(
  a: { latitude: number; longitude: number },
  b: { latitude?: number; longitude?: number }
) {
  if (b.latitude == null || b.longitude == null) return Infinity; // ignore bad data
  const R = 3958.8;
  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
