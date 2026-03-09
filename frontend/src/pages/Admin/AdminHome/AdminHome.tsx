import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAdminStats } from "../../../hooks/useAdminStats";
import { userApi } from "../../../services/api";
import styles from "./AdminHome.module.css";
import {
  HiUsers,
  HiTicket,
  HiClipboardList,
  HiShieldCheck,
  HiSparkles,
  HiLocationMarker,
  HiCurrencyDollar,
  HiStar,
  HiUserAdd,
} from "react-icons/hi";

const AdminHome = () => {
  const { t } = useTranslation();
  const { stats, loading, error, retry } = useAdminStats();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const loadPendingUsers = async () => {
      try {
        const users = await userApi.getPending();
        setPendingCount(users.length);
      } catch (e) {
        console.error("Erreur chargement pending users", e);
      }
    };
    loadPendingUsers();
  }, []);

  const getDisplayNumber = (value: number) => {
    return loading ? "..." : value || "—";
  };

  if (error) {
    return (
      <div className={styles.adminContainer}>
        <h1>{t("admin.home.titleError")}</h1>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>⚠️ {error}</p>
          <button onClick={retry} className={styles.retryButton}>
            {t("admin.home.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <h1>{t("admin.home.title")}</h1>
      <div className={styles.dashboardGrid}>
        {/* Producteurs en attente (Badge spécial) */}
        <Link to="/admin/users" className={styles.statCard} style={{ border: '2px solid #f5c518', backgroundColor: 'rgba(245, 197, 24, 0.05)' }}>
          <div className={styles.cardIcon}>
            <HiUserAdd style={{ color: '#f5c518' }} />
          </div>
          <p className={styles.statNumber} style={{ color: '#f5c518' }}>
            {pendingCount}
          </p>
          <h2 style={{ color: '#f5c518' }}>{t("admin.home.statPendingProducers")}</h2>
        </Link>

        {/* Utilisateurs inscrits */}
        <Link to="/admin/users" className={styles.statCard}>
          <div className={styles.cardIcon}>
            <HiUsers />
          </div>
          <p className={styles.statNumber}>
            {getDisplayNumber(stats.totalUsers)}
          </p>
          <h2>{t("admin.home.statUsers")}</h2>
        </Link>

        {/* Spectacles publiés */}
        <Link to="/admin/shows" className={styles.statCard}>
          <div className={styles.cardIcon}>
            <HiTicket />
          </div>
          <p className={styles.statNumber}>
            {getDisplayNumber(stats.totalShows)}
          </p>
          <h2>{t("admin.home.statShows")}</h2>
        </Link>

        {/* Réservations */}
        <Link to="/admin/reservations" className={styles.statCard}>
          <div className={styles.cardIcon}>
            <HiClipboardList />
          </div>
          <p className={styles.statNumber}>
            {getDisplayNumber(stats.totalReservations)}
          </p>
          <h2>{t("admin.home.statReservations")}</h2>
        </Link>

        {/* Avis en attente */}
        <Link to="/admin/reviews" className={styles.statCard}>
          <div className={styles.cardIcon}>
            <HiShieldCheck />
          </div>
          <p className={styles.statNumber}>
            {getDisplayNumber(stats.reviewStats?.pending || 0)}
          </p>
          <h2>{t("admin.home.statPendingReviews")}</h2>
        </Link>

        {/* Artistes */}
        <Link to="/admin/artists" className={styles.statCard}>
          <div className={styles.cardIcon}>
            <HiSparkles />
          </div>
          <p className={styles.statNumber}>
            {getDisplayNumber(stats.totalArtists)}
          </p>
          <h2>{t("admin.home.statArtists")}</h2>
        </Link>

        {/* Lieux */}
        <Link to="/admin/locations" className={styles.statCard}>
          <div className={styles.cardIcon}>
            <HiLocationMarker />
          </div>
          <p className={styles.statNumber}>
            {getDisplayNumber(stats.totalLocations)}
          </p>
          <h2>{t("admin.home.statLocations")}</h2>
        </Link>

        {/* Revenus totaux */}
        <div className={`${styles.statCard} ${styles.highlightCard}`}>
          <div className={styles.cardIcon}>
            <HiCurrencyDollar />
          </div>
          <p className={styles.statNumber}>
            {loading ? "..." : stats.reviewStats?.totalRevenue || 0} €
          </p>
          <h2>{t("admin.home.statTotalRevenue")}</h2>
        </div>

        {/* Note moyenne */}
        <div className={`${styles.statCard} ${styles.highlightCard}`}>
          <div className={styles.cardIcon}>
            <HiStar />
          </div>
          <p className={styles.statNumber}>
            {loading
              ? "..."
              : (stats.reviewStats?.averageRating || 0).toFixed(1)}
          </p>
          <h2>{t("admin.home.statAverageRating")}</h2>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
