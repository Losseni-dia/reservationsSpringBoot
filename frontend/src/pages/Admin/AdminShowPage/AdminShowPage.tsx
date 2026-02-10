// React hooks for state and side effects
import React, { useCallback, useEffect, useState } from "react";
// Navigation for redirecting to edit page
import { useNavigate } from "react-router-dom";
// API client for admin show operations (list, confirm, revoke)
import { showApi } from "../../../services/api";
// Show model and status type
import { Show, ShowStatus } from "../../../types/models";
// Loading spinner while fetching data
import Loader from "../../../components/ui/loader/Loader";
// Modal for confirming confirm/revoke actions
import ConfirmModal from "../../../components/ui/confirmModal/ConfirmModal";
// Toast notifications for success/error feedback
import Toast from "../../../components/ui/toast/Toast";
// Component styles
import styles from "./AdminShowPage.module.css";

/** Admin page: list all shows and moderate their status (confirm / revoke). */
const AdminShowPage: React.FC = () => {
  const navigate = useNavigate();

  // List data and request state: shows list, loading flag, error message
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal and toast UI state: show being confirmed/revoked, modal open, toast content and type
  const [showToConfirm, setShowToConfirm] = useState<Show | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("info");

  const fetchShows = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // NOUVEAU : On utilise la route admin qui bypass les filtres
      const data = await showApi.getAllForAdmin();

      // Tri : Les "A_CONFIRMER" en premier pour attirer l'attention de l'admin
      const sortedShows = data.sort((a, b) => {
        if (a.status === b.status) return 0;
        return a.status === 'A_CONFIRMER' ? -1 : 1;
      });

      setShows(sortedShows);
    } catch (err: any) {
      setError("Impossible de charger les spectacles.");
      setToastType("error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShows();
  }, [fetchShows]);

  const handleRefresh = useCallback(() => {
    fetchShows();
  }, [fetchShows]);

  const handleEditShow = useCallback((id: number) => {
      navigate(`/admin/shows/edit/${id}`);
    }, [navigate]
  );

const handleToggleConfirmShow = useCallback(async (show: Show) => {
    try {
        setLoading(true);

        // 1. Déterminer le nouveau statut
        const newStatus = show.status === 'CONFIRME' ? 'A_CONFIRMER' : 'CONFIRME';

        // 2. Appeler l'API
        if (show.status === 'CONFIRME') {
            await showApi.revoke(show.id);
        } else {
            await showApi.confirm(show.id);
        }

        // 3. Mise à jour intelligente du state
        setShows((prevShows) => {
            const updatedShow = { ...show, status: newStatus as any };
            const otherShows = prevShows.filter((s) => s.id !== show.id);
            
            if (newStatus === 'A_CONFIRMER') {
                // Si on révoque, on le met tout en haut (début du tableau)
                return [updatedShow, ...otherShows];
            } else {
                // Si on confirme, on le met tout en bas (fin du tableau)
                return [...otherShows, updatedShow];
            }
        });

        setToastMessage(newStatus === 'CONFIRME' ? "Spectacle confirmé !" : "Spectacle révoqué !");
        setToastType("success");

    } catch (err) {
        console.error("Erreur API:", err);
        setToastMessage("Erreur lors de la mise à jour");
        setToastType("error");
    } finally {
        setLoading(false);
    }
}, [setShows]);
  const handleOpenConfirmModal = useCallback((show: Show) => {
    setShowToConfirm(show);
    setIsConfirmModalOpen(true);
  }, []);

  const handleConfirmModalConfirm = useCallback(async () => {
    if (showToConfirm) {
      setIsConfirmModalOpen(false);
      await handleToggleConfirmShow(showToConfirm);
      setShowToConfirm(null);
    }
  }, [showToConfirm, handleToggleConfirmShow]);

  const handleConfirmModalCancel = useCallback(() => {
    setIsConfirmModalOpen(false);
    setShowToConfirm(null);
  }, []); 

  const renderShowsTable = () => {
    return (
      <table className={styles.showsTable}>
        <thead className={styles.tableHeader}>
          <tr>
            <th className={styles.tableHeaderCell}>Titre</th>
            <th className={styles.tableHeaderCell}>Localité</th>
            <th className={styles.tableHeaderCell}>Statut</th>
            <th className={styles.tableHeaderCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shows.map((show) => (
            <tr key={show.id} className={styles.tableRow}>
              <td className={styles.tableCell}>
                <div className={styles.showTitle}>{show.title}</div>
              </td>
              <td className={styles.tableCell}>
                {show.locationDesignation || "-"}
              </td>
              <td className={styles.tableCell}>
                <span
                  className={`${styles.statusBadge} ${
                    show.status === 'CONFIRME'
                      ? styles.statusConfirmed
                      : styles.statusPending
                  }`}
                >
                  {show.status === 'CONFIRME' ? "✓ Confirmé" : "⏳ À valider"}
                </span>
              </td>
              <td className={styles.tableCell}>
                <div className={styles.actionsCell}>
                  <button
                    className={`${styles.actionButton} ${styles.editButton}`}
                    onClick={() => handleEditShow(show.id)}
                  >
                    Modifier
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.confirmButton}`}
                    onClick={() => handleOpenConfirmModal(show)}
                    disabled={loading}
                  >
                    {show.status === 'CONFIRME' ? "Révoquer" : "Confirmer"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (loading && shows.length === 0) return <Loader />;

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1 className={styles.adminTitle}>Modération des Spectacles</h1>
        <button className={styles.refreshButton} onClick={handleRefresh}>
          Rafraîchir
        </button>
      </div>

      <div className={styles.showsListContainer}>
        {shows.length > 0 ? renderShowsTable() : <p>Aucun spectacle.</p>}
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title={showToConfirm?.status === 'CONFIRME' ? "Révoquer ?" : "Confirmer ?"}
        message={
          showToConfirm?.status === 'CONFIRME'
            ? `Retirer "${showToConfirm?.title}" du catalogue public ?`
            : `Rendre "${showToConfirm?.title}" visible et réservable par les clients ?`
        }
        confirmButtonClass={showToConfirm?.status === 'CONFIRME' ? "danger" : "success"}
        onConfirm={handleConfirmModalConfirm}
        onCancel={handleConfirmModalCancel}
      />
    </div>
  );
};

export default AdminShowPage;