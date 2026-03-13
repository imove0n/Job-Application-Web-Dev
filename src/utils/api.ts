import type { BookingFormData, TripEstimate } from '../types';

const MOCK_API_URL = 'https://jsonplaceholder.typicode.com/posts';
const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY || '';

export interface BookingSubmission extends BookingFormData {
  estimate: TripEstimate | null;
  submittedAt: string;
}

export async function submitBooking(
  data: BookingFormData,
  estimate: TripEstimate | null
): Promise<{ success: boolean; id: number }> {
  const submission: BookingSubmission = {
    ...data,
    estimate,
    submittedAt: new Date().toISOString(),
  };

  console.log('Submitting booking:', submission);

  // POST to mock API
  const response = await fetch(MOCK_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submission),
  });

  if (!response.ok) {
    throw new Error('Failed to submit booking');
  }

  const result = await response.json();
  return { success: true, id: result.id };
}

/**
 * Calculate distance + travel time using OpenRouteService (free, no credit card).
 * Falls back to Nominatim geocoding + Haversine estimate if no ORS key.
 */
export async function calculateRoute(
  originCoords: { lat: string; lon: string } | null,
  destCoords: { lat: string; lon: string } | null,
  originAddress: string,
  destAddress: string
): Promise<TripEstimate | null> {
  try {
    // Try to get coordinates if not provided
    const origin = originCoords || (await geocodeAddress(originAddress));
    const dest = destCoords || (await geocodeAddress(destAddress));

    if (!origin || !dest) {
      console.warn('Could not geocode addresses');
      return null;
    }

    // If we have an ORS API key, use their directions API
    if (ORS_API_KEY) {
      return await orsRoute(origin, dest);
    }

    // Fallback: use OSRM (free, no key needed)
    return await osrmRoute(origin, dest);
  } catch (err) {
    console.error('Route calculation error:', err);
    return null;
  }
}

/** Geocode an address using Nominatim (free, no key) */
async function geocodeAddress(
  address: string
): Promise<{ lat: string; lon: string } | null> {
  try {
    const params = new URLSearchParams({
      q: address,
      format: 'json',
      limit: '1',
    });
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`
    );
    const data = await res.json();
    if (data.length > 0) {
      return { lat: data[0].lat, lon: data[0].lon };
    }
    return null;
  } catch {
    return null;
  }
}

/** Route using OSRM — completely free, no API key needed */
async function osrmRoute(
  origin: { lat: string; lon: string },
  dest: { lat: string; lon: string }
): Promise<TripEstimate | null> {
  const url = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${dest.lon},${dest.lat}?overview=false`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.code === 'Ok' && data.routes?.length > 0) {
    const route = data.routes[0];
    const distanceMiles = (route.distance / 1609.34).toFixed(1);
    const durationMins = Math.round(route.duration / 60);

    return {
      distance: `${distanceMiles} mi`,
      duration:
        durationMins >= 60
          ? `${Math.floor(durationMins / 60)} hr ${durationMins % 60} min`
          : `${durationMins} min`,
    };
  }

  return null;
}

/** Route using OpenRouteService (free key, email signup only) */
async function orsRoute(
  origin: { lat: string; lon: string },
  dest: { lat: string; lon: string }
): Promise<TripEstimate | null> {
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${origin.lon},${origin.lat}&end=${dest.lon},${dest.lat}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.features?.length > 0) {
    const segment = data.features[0].properties.summary;
    const distanceMiles = (segment.distance / 1609.34).toFixed(1);
    const durationMins = Math.round(segment.duration / 60);

    return {
      distance: `${distanceMiles} mi`,
      duration:
        durationMins >= 60
          ? `${Math.floor(durationMins / 60)} hr ${durationMins % 60} min`
          : `${durationMins} min`,
    };
  }

  return null;
}
