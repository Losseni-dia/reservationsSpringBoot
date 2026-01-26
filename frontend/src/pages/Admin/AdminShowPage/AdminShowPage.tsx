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

  // States pour les données
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // States pour les modales et notifications
  const [showToConfirm, setShowToConfirm] = useState<Show | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "info",
  );

  const fetchShows = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await showApi.getAll();

      // Tri des spectacles : non confirmés (bookable=false) d'abord, puis confirmés
      const sortedShows = data.sort((a, b) => {
        if (a.bookable === b.bookable) return 0;
        return a.bookable ? 1 : -1;
      });

      setShows(sortedShows);
      setToastMessage("Spectacles chargés avec succès");
      setToastType("success");
    } catch (err: any) {
      console.error("Erreur lors du chargement des spectacles:", err);
      setError("Impossible de charger les spectacles. Veuillez réessayer.");
      setToastMessage("Erreur lors du chargement des données");
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



  const handleEditShow = useCallback(
    (id: number) => {
      navigate(`/admin/shows/edit/${id}`);
    },
    [navigate],
  );

const handleToggleConfirmShow = useCallback(
  async (show: Show) => {
    try {
      setLoading(true);
      
      // 1. Créer l'objet avec la modification
      const isBookable = !show.bookable;

      // 2. Transformer en FormData
      const formData = new FormData();
      formData.append("bookable", String(isBookable));
      // On ajoute souvent les autres champs requis par le backend
      formData.append("title", show.title);
      formData.append("description", show.description);
      formData.append("slug", show.slug);
      if (show.locationId) formData.append("locationId", String(show.locationId));

      // 3. Envoyer le FormData
      await showApi.update(show.id, formData);

      setToastMessage(
        isBookable
          ? `✓ Spectacle "${show.title}" confirmé`
          : `⏳ Spectacle "${show.title}" révoqué`
      );
      setToastType("success");
      await fetchShows();
    } catch (err: any) {
      console.error(err);
      setToastMessage("Erreur lors de la mise à jour");
      setToastType("error");
    } finally {
      setLoading(false);
    }
  },
  [fetchShows]
);

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
            <th className={styles.tableHeaderCell}>Description</th>
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
                <div
                  style={{
                    maxWidth: "300px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {show.description || "-"}
                </div>
              </td>
              <td className={styles.tableCell}>
                {show.locationDesignation || "-"}
              </td>
              <td className={styles.tableCell}>
                <span
                  className={`${styles.statusBadge} ${
                    show.bookable
                      ? styles.statusConfirmed
                      : styles.statusPending
                  }`}
                >
                  {show.bookable ? "✓ Confirmé" : "⏳ En attente"}
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
                    {show.bookable ? "Révoquer" : "Confirmer"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (loading) return <Loader />;

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1 className={styles.adminTitle}>Gestion des Spectacles</h1>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>

          <button
            className={styles.refreshButton}
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? "Chargement..." : "Rafraîchir"}
          </button>
        </div>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.showsListContainer}>
        {shows.length > 0 ? (
          <>
            <p className={styles.showsCount}>
              {shows.length} spectacle{shows.length > 1 ? "s" : ""} trouvé
              {shows.length > 1 ? "s" : ""}
            </p>
            {renderShowsTable()}
          </>
        ) : (
          <p className={styles.noShows}>Aucun spectacle trouvé</p>
        )}
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
        title={showToConfirm?.bookable ? "Révoquer le spectacle ?" : "Confirmer le spectacle ?"}
        message={
          showToConfirm?.bookable
            ? `Êtes-vous sûr de vouloir retirer le spectacle "${showToConfirm?.title}" de la visibilité publique ? Les clients ne pourront plus voir ce spectacle.`
            : `Êtes-vous sûr de vouloir confirmer le spectacle "${showToConfirm?.title}" ? Il sera visible par tous les clients et réservable.`
        }
        confirmButtonClass={showToConfirm?.bookable ? "danger" : "success"}
        onConfirm={handleConfirmModalConfirm}
        onCancel={handleConfirmModalCancel}
      />
    </div>
  );
};

export default AdminShowPage;
