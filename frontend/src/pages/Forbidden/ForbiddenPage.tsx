import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './ForbiddenPage.module.css';

const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.glow}></div>

      <h1 className={styles.errorCode}>403</h1>
      <h2 className={styles.title}>{t("forbidden.title")}</h2>
      
      <p className={styles.message}>
        {t("forbidden.message")}
      </p>

      <button className={styles.homeButton} onClick={handleGoHome}>
        {t("forbidden.backHome")}
      </button>

      <div style={{ marginTop: '50px', opacity: 0.3, fontSize: '12px', letterSpacing: '2px' }}>
        {t("forbidden.systemTagline")}
      </div>
    </div>
  );
};

export default ForbiddenPage;