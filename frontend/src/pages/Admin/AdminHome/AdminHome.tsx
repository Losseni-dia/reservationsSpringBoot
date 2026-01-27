import { Link } from "react-router-dom";
import { useAdminStats } from "../../../hooks/useAdminStats";
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
} from "react-icons/hi";

const AdminHome = () => {
  const { stats, loading, error, retry } = useAdminStats();

  const getDisplayNumber = (value: number) => {
    return loading ? "..." : value || "—";
  };

  if (error) {
    return (
      <div className={styles.adminContainer}>
        <h1>Tableau de Bord Administrateur</h1>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>⚠️ {error}</p>
          <button onClick={retry} className={styles.retryButton}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <h1>Espace Administrateur</h1>
      <div className={styles.dashboardGrid}>
        {/* Utilisateurs inscrits */}
        <Link to="/admin/users" className={styles.statCard}>
          <div className={styles.cardIcon}>
            <HiUsers />
          </div>
          <p className={styles.statNumber}>
            {getDisplayNumber(stats.totalUsers)}
          </p>
          <h2>Utilisateurs inscrits</h2>
        </Link>

        {/* Spectacles publiés */}
        <Link to="/admin/shows" className={styles.statCard}>
          <div className={styles.cardIcon}>
            <HiTicket />
          </div>
          <p className={styles.statNumber}>
            {getDisplayNumber(stats.totalShows)}
          </p>
          <h2>Spectacles publiés</h2>
        </Link>

        {/* Réservations */}
        <Link to="/admin/reservations" className={styles.statCard}>
          <div className={styles.cardIcon}>
            <HiClipboardList />
          </div>
          <p className={styles.statNumber}>
            {getDisplayNumber(stats.totalReservations)}
          </p>
          <h2>Réservations</h2>
        </Link>

        {/* Avis en attente */}
        <Link to="/admin/reviews" className={styles.statCard}>
          <div className={styles.cardIcon}>
            <HiShieldCheck />
          </div>
          <p className={styles.statNumber}>
            {getDisplayNumber(stats.reviewStats?.pending || 0)}
          </p>
          <h2>Avis en attente</h2>
        </Link>

        {/* Artistes */}
        <Link to="/admin/artists" className={styles.statCard}>
          <div className={styles.cardIcon}>
            <HiSparkles />
          </div>
          <p className={styles.statNumber}>
            {getDisplayNumber(stats.totalArtists)}
          </p>
          <h2>Artistes</h2>
        </Link>

        {/* Lieux */}
        <Link to="/admin/locations" className={styles.statCard}>
          <div className={styles.cardIcon}>
            <HiLocationMarker />
          </div>
          <p className={styles.statNumber}>
            {getDisplayNumber(stats.totalLocations)}
          </p>
          <h2>Lieux</h2>
        </Link>

        {/* Revenus totaux */}
        <div className={`${styles.statCard} ${styles.highlightCard}`}>
          <div className={styles.cardIcon}>
            <HiCurrencyDollar />
          </div>
          <p className={styles.statNumber}>
            {loading ? "..." : stats.reviewStats?.totalRevenue || 0} €
          </p>
          <h2>Revenus totaux</h2>
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
          <h2>Note moyenne</h2>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
