import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./PaymentSuccess.module.css"; // On réutilise ton super CSS !

const PaymentCancel: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={styles.successContainer}>
      <div className={styles.successCard}>
        {/* Un cercle rouge avec une croix pour l'annulation */}
        <div
          className={styles.checkCircle}
          style={{
            borderColor: "#FF3B3F",
            color: "#FF3B3F",
            backgroundColor: "rgba(255, 59, 63, 0.15)",
            boxShadow: "0 0 20px rgba(255, 59, 63, 0.3)",
          }}
        >
          ✕
        </div>

        <h1 className={styles.successTitle} style={{ color: "#FF3B3F" }}>
          Paiement annulé
          {/* Remplace par {t("payment.cancelTitle")} si tu l'ajoutes dans tes traductions */}
        </h1>

        <p className={styles.successMessage}>
          Votre session de paiement a été annulée ou a expiré. Aucun montant n'a
          été débité de votre carte.
          {/* Remplace par {t("payment.cancelMessage")} */}
        </p>

        <button
          onClick={() => navigate(-1)}
          className={styles.homeButton}
          style={{ marginBottom: "1rem" }}
        >
          Réessayer
        </button>

        <button onClick={() => navigate("/")} className={styles.cancelLink}>
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default PaymentCancel;
