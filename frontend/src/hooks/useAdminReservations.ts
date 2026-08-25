import { useState, useEffect, useCallback } from "react";
import { reservationApi } from "../services/api";
import type { ReservationAdminDto } from "../types/models";

export interface UseAdminReservationsResult {
  reservations: ReservationAdminDto[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useAdminReservations = (): UseAdminReservationsResult => {
  const [reservations, setReservations] = useState<ReservationAdminDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reservationApi.getAllForAdmin();
      setReservations(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des réservations";
      setError(message);
      console.error("Erreur useAdminReservations:", err);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  return {
    reservations,
    loading,
    error,
    refetch: fetchReservations,
  };
};
