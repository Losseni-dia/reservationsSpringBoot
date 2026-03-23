import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { reservationApi, showApi } from "../../services/api";
import { Show, Representation } from "../../types/models";
import { formatDateTime, formatCurrency } from "../../utils/format";
import styles from "./ReservationPage.module.css";

const ReservationPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [show, setShow] = useState<Show | null>(null);
  const [selectedRep, setSelectedRep] = useState<Representation | null>(null);

  // Nouvel état : stocke les quantités par ID de prix { [priceId]: quantity }
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      showApi
        .getBySlug(slug)
        .then((data) => {
          setShow(data);
          if (data.representations && data.representations.length > 0) {
            setSelectedRep(data.representations[0]);
          }
        })
        .catch(() => setError(t("booking.errorLoad")));
    }
  }, [slug, t]);

  const handleRepChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const repId = parseInt(e.target.value);
    const rep = show?.representations?.find((r) => r.id === repId) || null;
    setSelectedRep(rep);
    setQuantities({}); // Reset les quantités si on change de date
  };

  // Gérer le + / - pour chaque type de ticket
  const updateQuantity = (priceId: number, delta: number) => {
    setQuantities((prev) => {
      const currentQty = prev[priceId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      return { ...prev, [priceId]: newQty };
    });
  };

  // Calcul du total général
  const calculateTotal = () => {
    if (!selectedRep) return 0;
    return selectedRep.prices.reduce((sum, p) => {
      return sum + p.amount * (quantities[p.id] || 0);
    }, 0);
  };

  const handleConfirmReservation = async () => {
    const totalTickets = Object.values(quantities).reduce((a, b) => a + b, 0);

    if (totalTickets === 0) {
      setError(t("booking.selectAtLeastOne"));
      return;
    }

    setLoading(true);
    try {
      // On prépare la liste des items pour le backend
      const items =
        selectedRep?.prices
          .filter((p) => quantities[p.id] > 0)
          .map((p) => ({
            representationId: selectedRep.id,
            priceId: p.id,
            places: quantities[p.id],
          })) || [];

      const response: any = await reservationApi.create(items);
      const finalUrl = typeof response === "object" ? response.url : response;

      if (finalUrl?.includes("stripe.com")) {
        window.location.href = finalUrl;
      } else {
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
          {t("booking.showLabel")}{" "}
          <span className={styles.highlight}>{show?.title}</span>
        </p>

        {error && <div className={styles.errorMessage}>{error}</div>}

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
            ))}
          </select>
        </div>

        {/* Liste des tarifs avec sélecteurs de quantité */}
        <div className={styles.ticketTypeContainer}>
          <label className={styles.label}>{t("booking.selectTickets")}</label>
          {selectedRep?.prices?.map((p) => (
            <div key={p.id} className={styles.ticketRow}>
              <div className={styles.ticketInfo}>
                <span className={styles.ticketTypeName}>{p.type}</span>
                <span className={styles.ticketPrice}>
                  {formatCurrency(p.amount, i18n.language)}
                </span>
              </div>
              <div className={styles.quantitySelector}>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => updateQuantity(p.id, -1)}
                  disabled={!quantities[p.id]}
                >
                  {" "}
                  -{" "}
                </button>
                <span className={styles.qtyDisplay}>
                  {quantities[p.id] || 0}
                </span>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => updateQuantity(p.id, 1)}
                >
                  {" "}
                  +{" "}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.totalRow}>
          <span>{t("booking.totalToPay")}</span>
          <span className={styles.totalAmount}>
            {formatCurrency(calculateTotal(), i18n.language)}
          </span>
        </div>

        <button
          onClick={handleConfirmReservation}
          disabled={loading || calculateTotal() === 0}
          className={styles.submitButton}
        >
          {loading
            ? t("booking.preparePayment")
            : t("booking.proceedToPayment").toUpperCase()}
        </button>

        <button onClick={() => navigate(-1)} className={styles.cancelLink}>
          {t("booking.back")}
        </button>
      </div>
    </div>
  );
};

export default ReservationPage;
