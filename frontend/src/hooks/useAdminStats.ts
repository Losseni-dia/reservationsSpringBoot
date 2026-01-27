import { useState, useEffect } from "react";
import {
  userApi,
  showApi,
  locationApi,
  reservationApi,
  artistApi,
  reviewApi,
} from "../services/api";

interface AdminStats {
  totalUsers: number;
  totalShows: number;
  totalReservations: number;
  totalLocations: number;
  totalArtists: number;
  reviewStats: any;
}

interface UseAdminStatsResult {
  stats: AdminStats;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export const useAdminStats = (): UseAdminStatsResult => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalShows: 0,
    totalReservations: 0,
    totalLocations: 0,
    totalArtists: 0,
    reviewStats: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les données principales
      const [users, shows, locations, reservations, artists] =
        await Promise.all([
          userApi.getAll(),
          showApi.getAll(),
          locationApi.getAll(),
          reservationApi.getMyBookings(),
          artistApi.getAll(),
        ]);

      // Essayer de récupérer les stats des reviews (optionnel)
      let reviewStats = null;
      try {
        reviewStats = await reviewApi.getStats();
      } catch (reviewError) {
        console.warn("Endpoint review stats non disponible:", reviewError);
        // On continue sans les stats des reviews
      }

      setStats({
        totalUsers: users.length,
        totalShows: shows.length,
        totalLocations: locations.length,
        totalReservations: reservations.length,
        totalArtists: artists.length,
        reviewStats: reviewStats,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des statistiques";
      setError(errorMessage);
      console.error("Erreur useAdminStats:", err);
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    fetchStats();
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, retry };
};
