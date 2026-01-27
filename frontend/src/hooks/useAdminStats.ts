import { useState, useEffect } from "react";
import { userApi } from "../services/api";
import { showApi } from "../services/api";
import { locationApi } from "../services/api";
import { reservationApi } from "../services/api";

interface AdminStats {
  totalUsers: number;
  totalShows: number;
  totalReservations: number;
  totalLocations: number;
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
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const [users, shows, locations, reservations] = await Promise.all([
        userApi.getAll(),
        showApi.getAll(),
        locationApi.getAll(),
        reservationApi.getMyBookings(),
      ]);

      setStats({
        totalUsers: users.length,
        totalShows: shows.length,
        totalLocations: locations.length,
        totalReservations: reservations.length,
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
