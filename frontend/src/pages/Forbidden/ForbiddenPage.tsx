import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ForbiddenPage.module.css';

const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      {/* Effet de lumière violette en arrière-plan */}
      <div className={styles.glow}></div>

      <h1 className={styles.errorCode}>403</h1>
      <h2 className={styles.title}>Accès Interdit</h2>
      
      <p className={styles.message}>
        Désolé, vous n'avez pas les permissions nécessaires pour accéder aux coulisses de cette page.
      </p>

      <button className={styles.homeButton} onClick={handleGoHome}>
        Retour à l'accueil
      </button>

      {/* Petit rappel de la marque en bas */}
      <div style={{ marginTop: '50px', opacity: 0.3, fontSize: '12px', letterSpacing: '2px' }}>
        SMARTBOOKING SYSTEM
      </div>
    </div>
  );
};

export default ForbiddenPage;