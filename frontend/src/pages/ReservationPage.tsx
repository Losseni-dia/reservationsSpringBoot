import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { reservationApi, showApi } from "../services/api";
import { Show, Representation, Price } from "../types/models";
import { formatDateTime, formatCurrency } from "../utils/format";
import styles from "./ReservationPage.module.css";

const ReservationPage: React.FC = () => {
  const { t, i18n } = useTranslation();
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
          setError(t("booking.errorLoad")),
        );
    }
  }, [slug, t]);

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
    setError(t("booking.selectDateAndPrice"));
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
      setError(t("booking.errorPaymentLink"));
      setLoading(false);
    }
  } catch (err) {
    setError(t("booking.errorReservation"));
    setLoading(false);
  }
};

  if (!show && !error)
    return <div className={styles.loading}>{t("booking.loadingShow")}</div>;

  return (
    <div className={styles.reservationContainer}>
      <div className={styles.reservationCard}>
        <h2 className={styles.title}>{t("booking.title")}</h2>
        <p className={styles.subtitle}>
          {t("booking.showLabel")} <span className={styles.highlight}>{show?.title}</span>
        </p>

        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Sélection de la Date */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>{t("booking.chooseDate")}</label>
          <select
            className={styles.input}
            value={selectedRep?.id || ""}
            onChange={handleRepChange}
          >
            {show?.representations?.map((rep) => (
              <option key={rep.id} value={rep.id}>
                {formatDateTime(rep.when, i18n.language)}
              </option>
            )) ?? <option disabled>{t("booking.noDateAvailable")}</option>}
                        
          </select>
        </div>

        {/* Sélection du Tarif (Standard, VIP...) */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>{t("booking.priceType")}</label>
          <select
            className={styles.input}
            value={selectedPrice?.id || ""}
            onChange={handlePriceChange}
          >
            {selectedRep?.prices?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.type} - {formatCurrency(p.amount, i18n.language)}
              </option>
            ))}
          </select>
        </div>

        {/* Nombre de places */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>{t("booking.quantity")}</label>
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
          <span>{t("booking.unitPrice", { type: selectedPrice?.type ?? "" })}</span>
          <span>{formatCurrency(selectedPrice?.amount ?? 0, i18n.language)}</span>
        </div>

        <div className={styles.totalRow}>
          <span>{t("booking.totalToPay")}</span>
          <span className={styles.totalAmount}>
            {formatCurrency((selectedPrice?.amount ?? 0) * nbPlaces, i18n.language)}
          </span>
        </div>

        <button
          onClick={handleConfirmReservation}
          disabled={loading || !selectedPrice}
          className={styles.submitButton}
        >
          {loading ? t("booking.preparePayment") : t("booking.proceedToPayment").toUpperCase()}
        </button>

        <button onClick={() => navigate(-1)} className={styles.cancelLink}>
          {t("booking.back")}
        </button>
      </div>
    </div>
  );
};

export default ReservationPage;
