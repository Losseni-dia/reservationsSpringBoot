import { useState, useEffect } from "react";
import { adminApi, artistApi, reviewApi } from "../services/api";

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

      const [summary, artists] = await Promise.all([
        adminApi.getStatsSummary(),
        artistApi.getAll(),
      ]);

      let reviewStats = null;
      try {
        reviewStats = await reviewApi.getStats();
      } catch (reviewError) {
        console.warn("Endpoint review stats non disponible:", reviewError);
      }

      setStats({
        totalUsers: Number(summary.totalUsers) || 0,
        totalShows: Number(summary.totalShows) || 0,
        totalLocations: Number(summary.totalLocations) || 0,
        totalReservations: Number(summary.totalReservations) || 0,
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
