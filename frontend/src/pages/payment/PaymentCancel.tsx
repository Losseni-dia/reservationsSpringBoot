import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./PaymentSuccess.module.css";

const PaymentCancel: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={styles.successContainer}>
      <div className={styles.successCard}>
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
          {t("payment.cancelTitle", "Paiement annulé")}
        </h1>

        <p className={styles.successMessage}>
          {t(
            "payment.cancelMessage",
            "Votre session de paiement a été annulée ou a expiré. Aucun montant n'a été débité de votre carte.",
          )}
        </p>

        <button
          onClick={() => navigate(-1)}
          className={styles.homeButton}
          style={{ marginBottom: "1rem" }}
        >
          {t("payment.retry", "Réessayer")}
        </button>

        <Link
          to="/"
          className={styles.cancelLinkPayment}
          style={{ display: "block", marginTop: "1rem" }}
        >
          {t("payment.backHome", "Retour à l'accueil")}
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancel;
