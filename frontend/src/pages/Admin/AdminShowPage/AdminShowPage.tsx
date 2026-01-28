import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showApi } from "../../../services/api";
import { Show } from "../../../types/models";
import Loader from "../../../components/ui/loader/Loader";
import ConfirmModal from "../../../components/ui/confirmModal/ConfirmModal";
import Toast from "../../../components/ui/toast/Toast";
import styles from "./AdminShowPage.module.css";

const AdminShowPage: React.FC = () => {
  const navigate = useNavigate();

  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    
    let updatedShow: Show; // On prépare une variable pour stocker le retour

    if (show.status === 'CONFIRME') {
      // On récupère le spectacle mis à jour par l'API
      updatedShow = await showApi.revoke(show.id);
      setToastMessage(`⏳ "${show.title}" remis en attente`);
    } else {
      updatedShow = await showApi.confirm(show.id);
      setToastMessage(`✓ "${show.title}" publié`);
    }

    setToastType("success");

    // OPTIMISATION : Au lieu de fetchShows(), on met à jour le state localement
    setShows(prevShows => 
      prevShows.map(s => s.id === updatedShow.id ? updatedShow : s)
    );

    } catch (err: any) {
      setToastMessage("Erreur lors du changement de statut");
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