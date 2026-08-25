import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "../../components/context/AuthContext";
import styles from "./ProfilePage.module.css";

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!user) {
    return <div className="text-white text-center mt-5">{t("auth.loading")}</div>;
  }

  return (
    <div className={styles.container}>
      {/* La bannière pour les tickets */}
      <div className={styles.ticketShortcut}>
        <div className={styles.ticketContent}>
          <h3>{t("profile.myActiveTickets")}</h3>
          <p>{t("profile.ticketDescription")}</p>
        </div>
        <Link to="/profile/tickets" className={styles.ticketBtn}>
          🎟️ {t("profile.viewAllTickets")}
        </Link>
      </div>

      {/* Les informations de l'utilisateur en lecture seule */}
      <div className={styles.card}>
        <h2 className="text-white mb-4">{t("auth.profile.title")}</h2>
        <div className="text-center mb-4">
          <div className={styles.avatarWrapper}>
            <img 
              src={user.profilePictureUrl} 
              alt="Profil" 
              className={styles.profileImage} 
            />
          </div>
        </div>
        
        <div className={styles.form}>
          <div className="row mb-3">
            <div className="col">
              <label className={styles.label}>{t("auth.firstname")}</label>
              {/* Affichage en simple texte (tu peux adapter les classes CSS selon tes besoins) */}
              <p style={{ color: "white", fontSize: "1.1rem" }}>{user.firstname}</p>
            </div>
            <div className="col">
              <label className={styles.label}>{t("auth.lastname")}</label>
              <p style={{ color: "white", fontSize: "1.1rem" }}>{user.lastname}</p>
            </div>
          </div>

          <div className="mb-3">
            <label className={styles.label}>{t("auth.email")}</label>
            <p style={{ color: "white", fontSize: "1.1rem" }}>{user.email}</p>
          </div>

          <div className="mb-3">
            <label className={styles.label}>{t("auth.language")}</label>
            <p style={{ color: "white", fontSize: "1.1rem" }}>
              {/* Petite astuce pour afficher le vrai nom de la langue au lieu de "fr" ou "en" */}
              {user.langue === 'en' ? t("auth.langEn") : user.langue === 'nl' ? t("auth.langNl") : t("auth.langFr")}
            </p>
          </div>

          <div className={styles.editButtonContainer}>
            <Link 
              to="/profile/edit" 
              className={`${styles.btn} ${styles.editProfileBtn}`}
            >
              Modifier mes informations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;