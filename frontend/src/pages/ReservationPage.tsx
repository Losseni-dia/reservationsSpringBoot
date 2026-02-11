import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { reservationApi, showApi } from "../services/api";
import { Show, Representation, Price } from "../types/models";
import styles from "./ReservationPage.module.css";

const ReservationPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // États pour les données
  const [show, setShow] = useState<Show | null>(null);
  const [selectedRep, setSelectedRep] = useState<Representation | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<Price | null>(null);

  // États pour le formulaire
  const [nbPlaces, setNbPlaces] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Charger le spectacle via le slug
  useEffect(() => {
    if (slug) {
      showApi
        .getBySlug(slug)
        .then((data) => {
          setShow(data);
          // Sélectionner la 1ère représentation et son 1er prix par défaut
          if (data.representations && data.representations.length > 0) {
            const firstRep = data.representations[0];
            setSelectedRep(firstRep);
            if (firstRep.prices && firstRep.prices.length > 0) {
              setSelectedPrice(firstRep.prices[0]);
            }
          }
        })
        .catch(() =>
          setError("Impossible de charger les détails du spectacle."),
        );
    }
  }, [slug]);

  // 2. Gérer le changement de représentation (date)
const handleRepChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const repId = parseInt(e.target.value);

  // Ajout du ?. avant .find
  const rep = show?.representations?.find((r) => r.id === repId) || null;

  setSelectedRep(rep);

  // Reset le prix sur le premier disponible
  if (rep && rep.prices && rep.prices.length > 0) {
    setSelectedPrice(rep.prices[0]);
  }
};

  // 3. Gérer le changement de type de prix
  const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const priceId = parseInt(e.target.value);
    const price = selectedRep?.prices.find((p) => p.id === priceId) || null;
    setSelectedPrice(price);
  };

  // 4. Soumission de la réservation
const handleConfirmReservation = async () => {
  if (!selectedRep || !selectedPrice) {
    setError("Veuillez sélectionner une date et un tarif.");
    return;
  }

  setLoading(true);
  try {
    const items = [
      {
        representationId: selectedRep.id,
        priceId: selectedPrice.id,
        places: nbPlaces,
      },
    ];

    const response: any = await reservationApi.create(items);

    // On s'assure de n'avoir que l'URL (au cas où le service renvoie encore l'objet)
    const finalUrl = typeof response === "object" ? response.url : response;

    if (finalUrl && finalUrl.includes("stripe.com")) {
      console.log("Redirection vers :", finalUrl);
      window.location.href = finalUrl;
    } else {
      console.error("URL Stripe invalide :", finalUrl);
      setError("Le lien de paiement est corrompu.");
      setLoading(false);
    }
  } catch (err) {
    setError("Erreur lors de la réservation.");
    setLoading(false);
  }
};

  if (!show && !error)
    return <div className={styles.loading}>Chargement du spectacle...</div>;

  return (
    <div className={styles.reservationContainer}>
      <div className={styles.reservationCard}>
        <h2 className={styles.title}>Réserver vos places</h2>
        <p className={styles.subtitle}>
          Spectacle : <span className={styles.highlight}>{show?.title}</span>
        </p>

        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Sélection de la Date */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Choisir une date</label>
          <select
            className={styles.input}
            value={selectedRep?.id || ""}
            onChange={handleRepChange}
          >
            {show?.representations?.map((rep) => (
              <option key={rep.id} value={rep.id}>
                {new Date(rep.when).toLocaleString()}
              </option>
            )) ?? <option disabled>Aucune date disponible</option>}
                        
          </select>
        </div>

        {/* Sélection du Tarif (Standard, VIP...) */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Type de tarif</label>
          <select
            className={styles.input}
            value={selectedPrice?.id || ""}
            onChange={handlePriceChange}
          >
            {selectedRep?.prices.map((p) => (
              <option key={p.id} value={p.id}>
                {p.type} - {p.amount} €
              </option>
            ))}
          </select>
        </div>

        {/* Nombre de places */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Nombre de places</label>
          <input
            type="number"
            min="1"
            max="10"
            value={nbPlaces}
            onChange={(e) =>
              setNbPlaces(Math.max(1, parseInt(e.target.value) || 1))
            }
            className={styles.input}
          />
        </div>

        {/* Résumé du prix */}
        <div className={styles.priceInfo}>
          <span>Prix unitaire ({selectedPrice?.type}) :</span>
          <span>{selectedPrice?.amount || 0} €</span>
        </div>

        <div className={styles.totalRow}>
          <span>Total à payer :</span>
          <span className={styles.totalAmount}>
            {(selectedPrice?.amount || 0) * nbPlaces} €
          </span>
        </div>

        <button
          onClick={handleConfirmReservation}
          disabled={loading || !selectedPrice}
          className={styles.submitButton}
        >
          {loading ? "Préparation du paiement..." : "PROCÉDER AU PAIEMENT"}
        </button>

        <button onClick={() => navigate(-1)} className={styles.cancelLink}>
          Retour
        </button>
      </div>
    </div>
  );
};

export default ReservationPage;
