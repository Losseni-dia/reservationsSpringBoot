import {
  Artist,
  Show,
  Location,
  Review,
  Reservation,
  ReservationAdminDto,
  ReservationRequest,
  UserProfileDto,
  UserRegistrationDto,
} from "../types/models";
import i18n from "../i18n";

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

  headers.set("Accept", "application/json");
  headers.set("Accept-Language", i18n.language || "fr");

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

    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "Accept-Language": i18n.language || "fr",
      },
      body: params,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Identifiants incorrects");
    }
    return response;
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
    const headers = new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
      "Accept-Language": i18n.language || "fr",
    });
    const csrfToken = getCsrfToken();
    if (csrfToken) headers.append("X-XSRF-TOKEN", csrfToken);

    return fetch(`${API_BASE}/users/register`, {
      method: "POST",
      headers,
      body: JSON.stringify(userData),
      credentials: "include",
    });
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
  getAllInactive: async (): Promise<UserProfileDto[]> => {
    const res = await secureFetch("/api/users/inactive");
    return res.json();
  },
  getPending: async (): Promise<UserProfileDto[]> => {
    const res = await secureFetch("/api/users/pending");
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
  approve: async (userId: number) => {
    return await secureFetch(`/api/users/${userId}/approve`, {
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
  getAllForAdmin: async (): Promise<Show[]> => {
    const res = await secureFetch(`${API_BASE}/shows/admin`);
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
  confirm: async (id: number): Promise<Show> => {
    const res = await secureFetch(`${API_BASE}/shows/${id}/confirm`, {
      method: "PUT",
    });
    return res.json();
  },
  revoke: async (id: number): Promise<Show> => {
    const res = await secureFetch(`${API_BASE}/shows/${id}/revoke`, {
      method: "PUT",
    });
    return res.json();
  },
  getMyShows: async (): Promise<Show[]> => {
    const res = await secureFetch(`${API_BASE}/shows/my-shows`);
    return res.json();
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

export const artistTypeApi = {
  getAll: async (): Promise<any[]> => {
    const res = await secureFetch(`${API_BASE}/artist-types`);
    return res.json();
  },
};

export const reservationApi = {
  create: async (items: ReservationRequest[]): Promise<{ url: string }> => {
    const res = await secureFetch(`${API_BASE}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    });

    // Sécurité : On vérifie le type de contenu avant de parser
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return res.json();
    } else {
      // Si le backend renvoie l'URL directement en texte
      const urlText = await res.text();
      return { url: urlText };
    }
  },

  getMyBookings: async (): Promise<Reservation[]> => {
    const res = await secureFetch(`${API_BASE}/reservations/my-bookings`);
    return res.json();
  },

  getAllForAdmin: async (): Promise<ReservationAdminDto[]> => {
    const res = await secureFetch(`${API_BASE}/admin/reservations`);
    return res.json();
  },
};
export const reviewApi = {
  getByShow: async (showId: number): Promise<Review[]> => {
    const res = await secureFetch(`${API_BASE}/reviews/show/${showId}`);
    return res.json();
  },

  getPending: async (): Promise<Review[]> => {
    const res = await secureFetch(`${API_BASE}/reviews/pending`);
    return res.json();
  },

  validate: async (id: number): Promise<void> => {
    await secureFetch(`${API_BASE}/reviews/${id}/validate`, { method: "PUT" });
  },

  delete: async (id: number): Promise<void> => {
    await secureFetch(`${API_BASE}/reviews/${id}`, { method: "DELETE" });
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

export const translateApi = {
  translate: async (
    text: string,
    targetLang: string,
    sourceLang?: string,
  ): Promise<string> => {
    const res = await secureFetch(`${API_BASE}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        targetLang,
        sourceLang: sourceLang || "fr",
      }),
    });
    const data = await res.json();
    return data.translatedText ?? text;
  },
};

/** Live comment translation via Google Cloud (POST /api/translation/translate). Throws on 503 or other errors. */
export const translationApi = {
  translateComment: async (
    text: string,
    targetLanguage: string,
  ): Promise<string> => {
    const res = await secureFetch(`${API_BASE}/translation/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLanguage }),
    });
    const data = await res.json();
    return data.translatedText ?? text;
  },
};

export const locationApi = {
  getAll: async (): Promise<Location[]> => {
    const res = await secureFetch(`${API_BASE}/locations`);
    return res.json();
  },

  getById: async (id: number): Promise<Location> => {
    const res = await secureFetch(`${API_BASE}/locations/${id}`);
    return res.json();
  },

  create: async (location: Partial<Location>): Promise<Location> => {
    const res = await secureFetch(`${API_BASE}/locations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(location),
    });
    return res.json();
  },

  update: async (
    id: number,
    location: Partial<Location>,
  ): Promise<Location> => {
    const res = await secureFetch(`${API_BASE}/locations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(location),
    });
    return res.json();
  },

  deleteById: async (id: number): Promise<void> => {
    await secureFetch(`${API_BASE}/locations/${id}`, {
      method: "DELETE",
    });
  },
};

/** Réponse de GET /api/admin/stats/summary (compteurs globaux). */
export interface AdminStatsSummaryDto {
  totalUsers: number;
  totalShows: number;
  totalLocations: number;
  totalReservations: number;
}

// ✅ adminApi est maintenant un export indépendant et contient la nouvelle méthode
export const adminApi = {
  getStatsSummary: async (): Promise<AdminStatsSummaryDto> => {
    const res = await secureFetch(`${API_BASE}/admin/stats/summary`);
    return res.json();
  },

  exportData: async (
    type: string,
    format: "csv" | "json" = "csv",
  ): Promise<void> => {
    const res = await secureFetch(
      `${API_BASE}/admin/export/${type}?format=${format}`,
    );
    const blob = await res.blob();
    const extension = format === "json" ? ".json" : ".csv";
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_export_${new Date().toISOString().split("T")[0]}${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  importData: async (
    type: string,
    format: "csv" | "json",
    file: File,
  ): Promise<{ imported: number; skipped: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append("file", file);
    const headers = new Headers();
    const csrfToken = `; ${document.cookie}`
      .split(`; XSRF-TOKEN=`)
      .pop()
      ?.split(";")
      .shift();
    if (csrfToken) headers.append("X-XSRF-TOKEN", csrfToken);

    const res = await fetch(
      `${API_BASE}/admin/import/${type}?format=${format}`,
      {
        method: "POST",
        headers,
        body: formData,
        credentials: "include",
        cache: "no-cache",
      },
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `Erreur ${res.status}`);
    }
    return res.json();
  },
};
