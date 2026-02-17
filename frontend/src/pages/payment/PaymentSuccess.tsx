import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./PaymentSuccess.module.css";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const reservationId = searchParams.get("reservationId");

  useEffect(() => {
    localStorage.removeItem("cart");
  }, []);

  return (
    <div className="successContainer">
      <div className="successCard">
        <div className="checkCircle">✓</div>

        <h1 className="successTitle">{t("payment.title")}</h1>

        <p className="successMessage">
          {t("payment.message")}{" "}
          {reservationId && <span className="orderId">#{reservationId}</span>}{" "}
          {t("payment.isNowConfirmed")}.
        </p>

        <p
          className="successMessage"
          style={{ fontSize: "0.9rem", opacity: 0.7 }}
        >
          {t("payment.summaryEmail")}
        </p>

        <button onClick={() => navigate("/")} className="homeButton">
          {t("payment.backHome")}
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
