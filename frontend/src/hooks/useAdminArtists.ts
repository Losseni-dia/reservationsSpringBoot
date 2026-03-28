import { useState, useEffect, useCallback } from "react";
import { artistApi } from "../services/api";
import type { Artist } from "../types/models";

export interface UseAdminArtistsResult {
  artists: Artist[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useAdminArtists = (): UseAdminArtistsResult => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await artistApi.getAll();
      setArtists(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des artistes";
      setError(message);
      console.error("Erreur useAdminArtists:", err);
      setArtists([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  return {
    artists,
    loading,
    error,
    refetch: fetchArtists,
  };
};
