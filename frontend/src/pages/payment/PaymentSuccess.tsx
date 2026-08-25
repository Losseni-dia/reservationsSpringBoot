import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./PaymentSuccess.module.css";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const reservationId = searchParams.get("reservationId");

  useEffect(() => {
    localStorage.removeItem("cart");
  }, []);

  return (
    <div className={styles.successContainer}>
      <div className={styles.successCard}>
        <div className={styles.checkCircle}>✓</div>

        <h1 className={styles.successTitle}>{t("payment.title")}</h1>

        <p className={styles.successMessage}>
          {t("payment.message")}{" "}
          {reservationId && (
            <span className={styles.orderId}>#{reservationId}</span>
          )}{" "}
          {t("payment.isNowConfirmed")}.
        </p>

        <p
          className={styles.successMessage}
          style={{ fontSize: "0.95rem", opacity: 0.6, marginBottom: "1rem" }}
        >
          {t("payment.summaryEmail")}
        </p>

        <button onClick={() => navigate("/")} className={styles.homeButton}>
          {t("payment.backHome")}
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
