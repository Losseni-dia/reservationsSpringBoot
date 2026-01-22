import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showApi, IMAGE_STORAGE_BASE } from "../../../services/api";
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

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      setLoading(true);
      const data = await showApi.getAll();
      setShows(data);
      setError(null);
    } catch (err: any) {
      console.error("Erreur lors du chargement des spectacles:", err);
      setError("Impossible de charger les spectacles. Veuillez réessayer.");
      setToastMessage("Erreur lors du chargement des données");
      setToastType("error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1 className={styles.adminTitle}>Gestion des Spectacles</h1>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.showsListContainer}>
        {shows.length > 0 ? (
          <p>Nombre de spectacles: {shows.length}</p>
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
    </div>
  );
};

export default AdminShowPage;
