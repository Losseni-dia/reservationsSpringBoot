import { useState } from "react";

export const useStripeCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (items: any[]) => {
    setLoading(true);
    setError(null);

    try {
      // Récupération du token (si tu utilises le localStorage pour ton JWT)
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // À adapter selon ta sécurité
        },
        body: JSON.stringify(items),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la réservation");
      }

      // On attend l'URL renvoyée par ton StripeService (Spring Boot)
      const data = await response.json();

      if (data.url) {
        // Redirection vers la page de paiement Stripe
        window.location.href = data.url;
      } else {
        throw new Error("L'URL de paiement est introuvable");
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return { handleCheckout, loading, error };
};
