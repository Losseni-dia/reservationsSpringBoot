import {
  Artist,
  Show,
  Location,
  Review,
  Reservation,
  ReservationRequest,
  UserProfileDto,
  UserRegistrationDto,
} from "../types/models";

const API_BASE = "/api";
export const IMAGE_STORAGE_BASE = "";

function getCsrfToken(): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; XSRF-TOKEN=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

async function secureFetch(url: string, options: RequestInit = {}) {
  const method = options.method?.toUpperCase() || "GET";
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json"); // Utilisation de .set (conseil CodeRabbit)

  if (["POST", "PUT", "DELETE"].includes(method)) {
    const token = getCsrfToken();
    if (token) {
      headers.append("X-XSRF-TOKEN", token);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
    cache: "no-cache",
  });

  if (!response.ok) {
    if (response.status === 401) {
      return Promise.reject(new Error("UNAUTHORIZED"));
    }
    const errorText = await response.text();
    throw new Error(errorText || `Erreur ${response.status}`);
  }

  return response;
}

export const authApi = {
  login: async (credentials: { login: string; password: string }) => {
    const params = new URLSearchParams();
    params.append("login", credentials.login);
    params.append("password", credentials.password);

    return await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: params,
      credentials: "include",
    });
  },
  logout: async () => {
    try {
      return await secureFetch("/api/users/logout", { method: "POST" });
    } catch (e) {
      console.warn("Le serveur a déjà fermé la session ou erreur CSRF");
      return null;
    }
  },
  getProfile: async () => {
    const res = await secureFetch(`${API_BASE}/users/profile`);
    return res.json();
  },
  register: async (userData: UserRegistrationDto) => {
    const res = await secureFetch(`${API_BASE}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  },
  updateProfile: async (profileData: Partial<UserProfileDto>) => {
    const res = await secureFetch(`${API_BASE}/users/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });
    return res.text();
  },
};

export const userApi = {
  getAll: async (): Promise<UserProfileDto[]> => {
    const res = await secureFetch("/api/users");
    return res.json();
  },
  delete: async (id: number) => {
    return await secureFetch(`/api/users/${id}`, { method: "DELETE" });
  },
  deactivate: async (userId: number) => {
    return await secureFetch(`/api/users/${userId}/deactivate`, {
      method: "PUT",
    });
  },
  activate: async (userId: number) => {
    return await secureFetch(`/api/users/${userId}/activate`, {
      method: "PUT",
    });
  },
  toggleStatus: async (userId: number) => {
    return await secureFetch(`/api/users/${userId}/toggle-status`, {
      method: "PUT",
    });
  },
  getStats: async () => {
    const res = await secureFetch(`${API_BASE}/users/stats`);
    return res.json();
  },
};

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
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(artist),
    });
    return res.json();
  },
};

export const showApi = {
  getAll: async (): Promise<Show[]> => {
    const res = await secureFetch(`${API_BASE}/shows`);
    return res.json();
  },
  getById: async (id: number): Promise<Show> => {
    const res = await secureFetch(`${API_BASE}/shows/${id}`);
    return res.json();
  },
  getBySlug: async (slug: string): Promise<Show> => {
    const res = await secureFetch(`${API_BASE}/shows/slug/${slug}`);
    return res.json();
  },
  create: async (formData: FormData): Promise<Show> => {
    const res = await secureFetch(`${API_BASE}/shows`, {
      method: "POST",
      body: formData,
    });
    return res.json();
  },
  update: async (id: number, formData: FormData): Promise<Show> => {
    const res = await secureFetch(`${API_BASE}/shows/${id}`, {
      method: "PUT",
      body: formData,
    });
    return res.json();
  },
  deleteById: async (id: number): Promise<void> => {
    await secureFetch(`${API_BASE}/shows/${id}`, { method: "DELETE" });
  },
};

export const representationApi = {
  // Uniquement pour la gestion des représentations elles-mêmes
  delete: async (id: number) => {
    return secureFetch(`${API_BASE}/representations/${id}`, {
      method: "DELETE",
    });
  },
};

export const reservationApi = {
  create: async (items: ReservationRequest[]): Promise<{ url: string }> => {
    const res = await secureFetch(`${API_BASE}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    });
    return res.json();
  },
  getMyBookings: async (): Promise<Reservation[]> => {
    const res = await secureFetch(`${API_BASE}/reservations/my-bookings`);
    return res.json();
  },
};

export const reviewApi = {
  getByShow: async (showId: number): Promise<Review[]> => {
    const res = await secureFetch(`${API_BASE}/reviews/show/${showId}`);
    return res.json();
  },
  create: async (
    showId: number,
    comment: string,
    stars: number,
  ): Promise<Review> => {
    const res = await secureFetch(`${API_BASE}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ showId, comment, stars }),
    });
    return res.json();
  },
  getStats: async (): Promise<any> => {
    const res = await secureFetch(`${API_BASE}/reviews/admin/stats`);
    return res.json();
  },
};
