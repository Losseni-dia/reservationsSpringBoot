import { 
    Artist, Show, Location, Review, 
    Reservation, ReservationRequest 
} from '../types/models';

const API_BASE = '/api';

/**
 * URL de base pour les médias (images uploads)
 * Pointe vers ton dossier configurer dans Spring Boot
 */
export const IMAGE_STORAGE_BASE = '/uploads/';

// --- UTILITAIRE DE SÉCURITÉ ---

function getCsrfToken(): string | undefined {
    return document.cookie.split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
}

async function secureFetch(url: string, options: RequestInit = {}) {
    const method = options.method?.toUpperCase() || 'GET';
    const headers = new Headers(options.headers);

    if (['POST', 'PUT', 'DELETE'].includes(method)) {
        const token = getCsrfToken();
        if (token) {
            headers.append('X-XSRF-TOKEN', token);
        }
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Erreur ${response.status}`);
    }

    return response;
}

// --- API MODULES ---

export const artistApi = {
    getAll: async (): Promise<Artist[]> => {
        const res = await secureFetch(`${API_BASE}/artists`);
        return res.json();
    },
    getById: async (id: number): Promise<Artist> => {
        const res = await secureFetch(`${API_BASE}/artists/${id}`);
        return res.json();
    },
    create: async (artist: Partial<Artist>): Promise<Artist> => {
        const res = await secureFetch(`${API_BASE}/artists/admin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(artist),
        });
        return res.json();
    }
};

export const showApi = {
    getAll: async (): Promise<Show[]> => {
        const res = await secureFetch(`${API_BASE}/shows`);
        return res.json();
    },
    getBySlug: async (slug: string): Promise<Show> => {
        const res = await secureFetch(`${API_BASE}/shows/slug/${slug}`);
        return res.json();
    }
};

export const locationApi = {
    getAll: async (): Promise<Location[]> => {
        const res = await secureFetch(`${API_BASE}/locations`);
        return res.json();
    }
};

export const reservationApi = {
    create: async (items: ReservationRequest[]): Promise<string> => {
        const res = await secureFetch(`${API_BASE}/reservations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(items),
        });
        return res.text();
    },
    getMyBookings: async (): Promise<Reservation[]> => {
        const res = await secureFetch(`${API_BASE}/reservations/my-bookings`);
        return res.json();
    }
};

export const reviewApi = {
    getByShow: async (showId: number): Promise<Review[]> => {
        const res = await secureFetch(`${API_BASE}/reviews/show/${showId}`);
        return res.json();
    }
};