import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import ExportButton from '../../../components/ui/exportButton/ExportButton';
import ImportZone from '../../../components/ui/importZone/ImportZone';
import AdminBackToDashboardButton from '../../../components/admin/AdminBackToDashboardButton';
// Dans adminHeader, ajouter ExportButton + ImportZone collapsible

const AdminShowPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // List data and request state: shows list, loading flag, error message
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);

  // Modal and toast UI state: show being confirmed/revoked, modal open, toast content and type
  const [showToConfirm, setShowToConfirm] = useState<Show | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("info");
  const [showImport, setShowImport] = useState<boolean>(false); 
  /** Fetches all shows for admin (no filters), sorts by status, updates state. */
  const fetchShows = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Admin route that bypasses public filters (returns all shows)
      const data = await showApi.getAllForAdmin();

      // Sort so "A_CONFIRMER" (pending) appear first to draw admin attention
      const sortedShows = data.sort((a: Show, b: Show) => {
        if (a.status === b.status) return 0;
        return a.status === ShowStatus.A_CONFIRMER ? -1 : 1; // <-- Modification ici
      });

      setShows(sortedShows);
    } catch (err: any) {
      setError(t("admin.shows.errorLoad"));
      setToastType("error");
    } finally {
      setLoading(false);
    }
  }, [t]);
  

  // Load shows when the component mounts (and when fetchShows reference changes)
  useEffect(() => {
    fetchShows();
  }, [fetchShows]);

  // Refetch shows when user clicks the refresh button
  const handleRefresh = useCallback(() => {
    fetchShows();
  }, [fetchShows]);

  // Navigate to the edit page for the given show id
  const handleEditShow = useCallback((id: number) => {
      navigate(`/admin/shows/edit/${id}`);
    }, [navigate]
  );

/** Toggles show status between CONFIRME and A_CONFIRMER; calls API then updates local state and toast. */
const handleToggleConfirmShow = useCallback(async (show: Show) => {
    try {
        setLoading(true);

        // Determine the new status (flip current one)
const newStatus = show.status === ShowStatus.CONFIRME 
            ? ShowStatus.A_CONFIRMER 
            : ShowStatus.CONFIRME;
        // Call API: revoke or confirm depending on current status
        if (show.status === ShowStatus.CONFIRME) {
            await showApi.revoke(show.id);
        } else {
            await showApi.confirm(show.id);
        }

        // Update list: revoked at top, confirmed at bottom (keeps sort order consistent)
        setShows((prevShows) => {
            const updatedShow = { ...show, status: newStatus };
            const otherShows = prevShows.filter((s) => s.id !== show.id);
            
            if (newStatus === ShowStatus.A_CONFIRMER) {
                return [updatedShow, ...otherShows];
            } else {
                return [...otherShows, updatedShow];
            }
        });

        setToastMessage(newStatus === ShowStatus.CONFIRME ? t("admin.shows.toastConfirmed") : t("admin.shows.toastRevoked"));
        setToastType("success");

    } catch (err) {
        console.error("Erreur API:", err);
        setToastMessage(t("admin.shows.toastError"));
        setToastType("error");
    } finally {
        setLoading(false);
    }
}, [t]);

  // Open confirm/revoke modal and store the show to act on
  const handleOpenConfirmModal = useCallback((show: Show) => {
    setShowToConfirm(show);
    setIsConfirmModalOpen(true);
  }, []);

  // User confirmed in modal: close modal, toggle show status, clear selection
  const handleConfirmModalConfirm = useCallback(async () => {
    if (showToConfirm) {
      setIsConfirmModalOpen(false);
      await handleToggleConfirmShow(showToConfirm);
      setShowToConfirm(null);
    }
  }, [showToConfirm, handleToggleConfirmShow]);

  // User cancelled: close modal and clear selected show
  const handleConfirmModalCancel = useCallback(() => {
    setIsConfirmModalOpen(false);
    setShowToConfirm(null);
  }, []); 

  /** Renders the table of shows: title, location, status badge, edit and confirm/revoke actions. */
  const renderShowsTable = () => {
    return (
      <table className={styles.showsTable}>
        <thead className={styles.tableHeader}>
          <tr>
            <th className={styles.tableHeaderCell}>{t("admin.shows.colTitle")}</th>
            <th className={styles.tableHeaderCell}>{t("admin.shows.colLocation")}</th>
            <th className={styles.tableHeaderCell}>{t("admin.shows.colStatus")}</th>
            <th className={styles.tableHeaderCell}>{t("admin.shows.colActions")}</th>
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
                    show.status === ShowStatus.CONFIRME
                      ? styles.statusConfirmed
                      : styles.statusPending
                  }`}
                >
                  {show.status === ShowStatus.CONFIRME ? t("admin.shows.statusConfirmed") : t("admin.shows.statusPending")}
                </span>
              </td>
              <td className={styles.tableCell}>
                <div className={styles.actionsCell}>
                  <button
                    className={`${styles.actionButton} ${styles.editButton}`}
                    onClick={() => handleEditShow(show.id)}
                  >
                    {t("admin.shows.edit")}
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.confirmButton}`}
                    onClick={() => handleOpenConfirmModal(show)}
                    disabled={loading}
                  >
                    {show.status === ShowStatus.CONFIRME ? t("admin.shows.revoke") : t("admin.shows.confirm")}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Show loader only on initial load (no shows yet)
  if (loading && shows.length === 0) return <Loader />;

  return (
    <div className={styles.adminContainer}>
  <AdminBackToDashboardButton />
  <h1 className={styles.adminTitle}>{t("admin.shows.title")}</h1>
  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
    <ExportButton type="shows" label="Exporter" />
    <button
      type="button"
      className={styles.refreshButton}
      onClick={() => setShowImport(prev => !prev)}
    >
      {showImport ? "Masquer l'import" : "Importer des spectacles"}
    </button>
    <button className={styles.refreshButton} onClick={handleRefresh}>
      {t("admin.shows.refresh")}
    </button>
  </div>
  {showImport && (
    <div style={{ marginTop: '1rem' }}>
      <ImportZone type="shows" onSuccess={fetchShows} />
    </div>
  )}

      {/* Shows list: table or empty state message */}
      <div className={styles.showsListContainer}>
        {shows.length > 0 ? renderShowsTable() : <p>{t("admin.shows.empty")}</p>}
      </div>

      {/* Toast for success/error feedback */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Confirm/revoke confirmation modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title={showToConfirm?.status === ShowStatus.CONFIRME ? t("admin.shows.modalRevokeTitle") : t("admin.shows.modalConfirmTitle")} // <-- 1. Modification ici
        message={
          showToConfirm?.status === ShowStatus.CONFIRME // <-- 2. Modification ici
            ? t("admin.shows.modalRevokeMessage", { title: showToConfirm?.title })
            : t("admin.shows.modalConfirmMessage", { title: showToConfirm?.title })
        }
        confirmButtonClass={showToConfirm?.status === ShowStatus.CONFIRME ? "danger" : "success"} // <-- 3. Modification ici
        onConfirm={handleConfirmModalConfirm}
        onCancel={handleConfirmModalCancel}
      />
    </div>
  );
};

export default AdminShowPage;