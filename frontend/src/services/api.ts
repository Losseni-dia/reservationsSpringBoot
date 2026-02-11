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
/**
 * URL de base pour les médias (images uploads)
 * Pointe vers ton dossier configurer dans Spring Boot
 */
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

  headers.append("Accept", "application/json");

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

  // --- LOGIQUE AJUSTÉE ICI ---
  if (!response.ok) {
    if (response.status === 401) {
      // On utilise un message informatif simple au lieu d'une erreur bloquante
      // Cela permet à AuthContext de mettre l'utilisateur à null proprement
      return Promise.reject(new Error("UNAUTHORIZED"));
    }

    // Pour les autres erreurs (404, 500), on garde le throw car ce sont de vrais problèmes
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

    // DOIT ETRE /api/users/login pour matcher ton SpringSecurityConfig
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
      // On appelle le logout. Si secureFetch échoue (ex: 401 ou CSRF manquant),
      // on attrape l'erreur pour ne pas bloquer le flux utilisateur.
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

    // Le backend peut renvoyer du texte brut (ex: "Utilisateur créé") ou du JSON
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
  forgotPassword: async (email: string) => {
    const res = await secureFetch(`${API_BASE}/users/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return res.text();
  },
  resetPassword: async (token: string, password: string) => {
    const res = await secureFetch(`${API_BASE}/users/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    return res.text();
  },
};

// --- API MODULES ---

export const userApi = {
  // Lister tous les utilisateurs (Route @GetMapping("/api/users") protégée par ADMIN)
  getAll: async (): Promise<UserProfileDto[]> => {
    const res = await secureFetch("/api/users");
    return res.json();
  },

  // Supprimer un utilisateur spécifique
  delete: async (id: number) => {
    return await secureFetch(`/api/users/${id}`, {
      method: "DELETE",
    });
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

export const artistTypeApi = {
  getAll: async (): Promise<any[]> => {
    const res = await secureFetch(`${API_BASE}/artist-types`);
    return res.json();
  },
};

export const showApi = {
  // Récupère le catalogue public (CONFIRME uniquement)
  getAll: async (): Promise<Show[]> => {
    const res = await secureFetch(`${API_BASE}/shows`);
    return res.json();
  },
  // Récupère TOUS les spectacles pour l'admin (A_CONFIRMER + CONFIRME)
  getAllForAdmin: async (): Promise<Show[]> => {
    const res = await secureFetch(`${API_BASE}/shows/admin`);
    return res.json();
  },

  revoke: async (id: number): Promise<Show> => {
    const res = await secureFetch(`${API_BASE}/shows/${id}/revoke`, {
      method: "PUT",
    });
    return res.json();
  },

  // NOUVEAU : Valider un spectacle
  confirm: async (id: number): Promise<Show> => {
    const res = await secureFetch(`${API_BASE}/shows/${id}/confirm`, {
      method: "PUT",
    });
    return res.json();
  },

  // Récupère par ID
  getById: async (id: number): Promise<Show> => {
    const res = await secureFetch(`${API_BASE}/shows/${id}`);
    return res.json();
  },

  // Récupère par slug
  getBySlug: async (slug: string): Promise<Show> => {
    const res = await secureFetch(`${API_BASE}/shows/slug/${slug}`);
    return res.json();
  },

  // Recherche multi-critères
  search: async (params: {
    title?: string;
    location?: string;
    start?: string;
    end?: string;
  }): Promise<Show[]> => {
    const queryParams = new URLSearchParams();
    if (params.title) queryParams.append("title", params.title);
    if (params.location) queryParams.append("location", params.location);
    if (params.start) queryParams.append("start", params.start);
    if (params.end) queryParams.append("end", params.end);

    const res = await secureFetch(
      `${API_BASE}/shows/search?${queryParams.toString()}`,
    );
    return res.json();
  },

  // Création (Une seule version propre)
  create: async (formData: FormData): Promise<Show> => {
    // 1. On utilise secureFetch (ou fetch)
    const res = await secureFetch(`${API_BASE}/shows`, {
      method: "POST",
      /* ATTENTION : Ne surtout pas mettre de 'Content-Type': 'application/json'.
            En passant un objet FormData dans le body, le navigateur va 
            automatiquement configurer le Header 'multipart/form-data' 
            AVEC la "boundary" (délimiteur) nécessaire pour le serveur.
            */
      body: formData,
    });

    return res.json();
  },

  // Mise à jour
  update: async (id: number, formData: FormData): Promise<Show> => {
    const res = await secureFetch(`${API_BASE}/shows/${id}`, {
      method: "PUT",
      body: formData, // Pas de JSON.stringify ici, FormData s'occupe de tout
    });
    return res.json();
  },
  // Suppression
  deleteById: async (id: number): Promise<void> => {
    await secureFetch(`${API_BASE}/shows/${id}`, {
      method: "DELETE",
    });
  },
};

export const representationApi = {
  // Dans ton fichier services/api.ts
  // Dans services/api.ts
  create: async (items: any): Promise<string> => {
    const res = await secureFetch(`${API_BASE}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    });

    const data = await res.json();
    // Si data est { url: "http..." }, on renvoie data.url
    return data.url || data;
  },
  getMyBookings: async (): Promise<Reservation[]> => {
    const res = await secureFetch(`${API_BASE}/reservations/my-bookings`);
    return res.json();
  },
  delete: async (id: number) => {
    return secureFetch(`${API_BASE}/representations/${id}`, {
      method: "DELETE",
    });
  },
};

export const locationApi = {
  getAll: async (): Promise<Location[]> => {
    const res = await secureFetch(`${API_BASE}/locations`);
    return res.json();
  },
};

export const reservationApi = {
  create: async (items: ReservationRequest[]): Promise<any> => {
    const res = await secureFetch(`${API_BASE}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    });
    // On récupère le JSON { "url": "..." }
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

  getPending: async (): Promise<Review[]> => {
    const res = await secureFetch(`${API_BASE}/reviews/pending`);
    return res.json();
  },
  validate: async (id: number) => {
    return await secureFetch(`${API_BASE}/reviews/${id}/validate`, {
      method: "PUT",
    });
  },
  delete: async (id: number) => {
    return await secureFetch(`${API_BASE}/reviews/${id}`, {
      method: "DELETE",
    });
  },

  // RÉCUPÉRER LES STATISTIQUES GLOBALES (admin)
  getStats: async (): Promise<any> => {
    const res = await secureFetch(`${API_BASE}/reviews/admin/stats`);
    return res.json();
  },
};
