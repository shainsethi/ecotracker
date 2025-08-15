export interface RecyclingCenter {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  acceptedTypes: string[];
  rating: number;
  isOpen: boolean;
  hours?: string;
  description?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

type ApiCenter = {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  address?: { formatted?: string } | string;
  location?: { coordinates?: [number, number] };
  contact?: { phone?: string; website?: string };
  acceptedTypes?: string[];
  rating?: { average?: number } | number;
  isCurrentlyOpen?: boolean;
  isOpen?: boolean;
  operatingHours?: unknown;
};

function mapCenter(doc: ApiCenter): RecyclingCenter {
  const center: RecyclingCenter = {
    id: (doc._id || doc.id) as string,
    name: doc.name,
    address: typeof doc.address === 'string' ? doc.address : (doc.address?.formatted ?? ''),
    lat: (doc.location?.coordinates?.[1] as number) ?? 0,
    lng: (doc.location?.coordinates?.[0] as number) ?? 0,
    phone: doc.contact?.phone,
    website: doc.contact?.website,
    acceptedTypes: doc.acceptedTypes || [],
    rating: typeof doc.rating === 'number' ? doc.rating : (doc.rating?.average ?? 0),
    isOpen: doc.isCurrentlyOpen ?? doc.isOpen ?? false,
    hours: doc.operatingHours ? 'See details' : undefined,
    description: doc.description
  };
  center.address = center.address || '';
  return center;
}

type ErrorResponse = { error?: string; message?: string };

async function handleJson<T>(res: Response): Promise<T> {
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    let message = 'Request failed';
    if (data && typeof data === 'object') {
      const { error, message: msg } = data as ErrorResponse;
      message = error || msg || message;
    }
    throw new Error(message);
  }
  return data as T;
}

class CenterService {
  async searchNearby(lat: number, lng: number, radius: number = 10): Promise<RecyclingCenter[]> {
    try {
      const url = new URL(`${API_BASE_URL}/centers/search/nearby`);
      url.searchParams.set('lat', String(lat));
      url.searchParams.set('lng', String(lng));
      url.searchParams.set('radius', String(radius * 1000)); // backend expects meters
      const res = await fetch(url.toString());
      const data = await handleJson<{ centers: ApiCenter[] }>(res);
      return data.centers.map(mapCenter);
    } catch {
      // Fallback to empty list
      return [];
    }
  }

  async getAllCenters(): Promise<RecyclingCenter[]> {
      const res = await fetch(`${API_BASE_URL}/centers`);
      const data = await handleJson<{ centers: ApiCenter[] }>(res);
      return data.centers.map(mapCenter);
  }

  async getCenterById(id: string): Promise<RecyclingCenter | null> {
      const res = await fetch(`${API_BASE_URL}/centers/${id}`);
      const data = await handleJson<{ center: ApiCenter }>(res);
      return data.center ? mapCenter(data.center) : null;
  }

  async addCenter(center: Omit<RecyclingCenter, 'id' | 'lat' | 'lng' | 'address'> & { address: string; lat: number; lng: number }): Promise<RecyclingCenter> {
      const payload = {
        name: center.name,
        description: center.description,
        address: { formatted: center.address },
        location: { type: 'Point', coordinates: [center.lng, center.lat] },
        contact: { phone: center.phone, website: center.website },
        acceptedTypes: center.acceptedTypes
      };
      const res = await fetch(`${API_BASE_URL}/centers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload)
      });
      const data = await handleJson<{ center: ApiCenter }>(res);
      return mapCenter(data.center);
  }

  async updateCenter(id: string, updates: Partial<RecyclingCenter>): Promise<RecyclingCenter | null> {
      const payload: Record<string, unknown> = {};
      if (updates.name) payload.name = updates.name;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.address) payload.address = { formatted: updates.address };
      if (updates.lat !== undefined && updates.lng !== undefined) {
        payload.location = { type: 'Point', coordinates: [updates.lng, updates.lat] };
      }
      if (updates.phone || updates.website) {
        payload.contact = { phone: updates.phone, website: updates.website };
      }
      if (updates.acceptedTypes) payload.acceptedTypes = updates.acceptedTypes;

      const res = await fetch(`${API_BASE_URL}/centers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload)
      });
      const data = await handleJson<{ center: ApiCenter }>(res);
      return mapCenter(data.center);
  }

  async deleteCenter(id: string): Promise<boolean> {
      const res = await fetch(`${API_BASE_URL}/centers/${id}`, {
        method: 'DELETE',
        headers: { ...authHeaders() }
      });
      if (!res.ok) return false;
      return true;
  }
}

export const centerService = new CenterService();