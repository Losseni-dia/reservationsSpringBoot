import { Link } from 'react-router-dom';
import styles from './AdminHome.module.css';

const AdminHome = () => {
  return (
    <div className={styles.adminContainer}>
      <h1>Tableau de Bord Administrateur</h1>
      <div className={styles.dashboardGrid}>
        <Link to="/admin/users" className={styles.statCard}>
          <h2>Utilisateurs</h2>
          <p className={styles.statNumber}>—</p>
          <span>Gérer</span>
        </Link>
        <Link to="/admin/shows" className={styles.statCard}>
          <h2>Spectacles</h2>
          <p className={styles.statNumber}>—</p>
          <span>Gérer</span>
        </Link>
        <Link to="/admin/reservations" className={styles.statCard}>
          <h2>Réservations</h2>
          <p className={styles.statNumber}>—</p>
          <span>Gérer</span>
        </Link>
        <Link to="/admin/locations" className={styles.statCard}>
          <h2>Lieux</h2>
          <p className={styles.statNumber}>—</p>
          <span>Gérer</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminHome;
