import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./PaymentSuccess.css"; // Import du nouveau CSS

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reservationId = searchParams.get("reservationId");

  useEffect(() => {
    // Optionnel : vider le panier local
    localStorage.removeItem("cart");
  }, []);

  return (
    <div className="successContainer">
      <div className="successCard">
        <div className="checkCircle">✓</div>

        <h1 className="successTitle">Paiement Réussi !</h1>

        <p className="successMessage">
          Merci pour votre achat. Votre réservation{" "}
          {reservationId && <span className="orderId">#{reservationId}</span>}{" "}
          est maintenant confirmée.
        </p>

        <p
          className="successMessage"
          style={{ fontSize: "0.9rem", opacity: 0.7 }}
        >
          Un récapitulatif a été envoyé à votre adresse email.
        </p>

        <button onClick={() => navigate("/")} className="homeButton">
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
