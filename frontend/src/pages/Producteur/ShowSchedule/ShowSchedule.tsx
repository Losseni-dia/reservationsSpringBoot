import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { showApi, representationApi, locationApi } from "../../../services/api";
import { formatDate, formatTime, formatCurrency } from "../../../utils/format";
import { TypePrice } from "../../../types/enums";
import { Show, Location } from "../../../types/models";
import styles from "./ShowSchedule.module.css";
import Toast from "../../../components/ui/toast/Toast";

const ShowSchedule: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [show, setShow] = useState<Show | null>(null);
  const [locations, setLocations] = useState<Location[]>([]); // Liste des lieux pour le select
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  // État pour la nouvelle séance
  const [newRep, setNewRep] = useState({
    when: "",
    locationId: "" as number | "",
    prices: [
      { type: TypePrice.STANDARD, amount: 0 },
      { type: TypePrice.REDUIT, amount: 0 },
      { type: TypePrice.VIP, amount: 0 },
    ],
  });

  const loadInitialData = async () => {
    if (!id) return;
    try {
      // On charge le spectacle ET la liste des lieux en parallèle
      const [showData, locsData] = await Promise.all([
        showApi.getById(Number(id)),
        locationApi.getAll(),
      ]);

      setShow(showData);
      setLocations(locsData);

      // On pré-remplit le lieu de la séance avec celui du spectacle par défaut
      setNewRep((prev) => ({
        ...prev,
        locationId: showData.locationId || "",
      }));
    } catch (err) {
      console.error("Erreur de chargement", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [id]);

  const handlePriceChange = (index: number, value: number) => {
    const updatedPrices = [...newRep.prices];
    updatedPrices[index].amount = value;
    setNewRep({ ...newRep, prices: updatedPrices });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newRep.when || !newRep.locationId) {
      setToast({
        msg: t("producer.schedule.alertFillDateLocation"),
        type: "error",
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...newRep,
        locationId: Number(newRep.locationId),
        when: newRep.when.replace(" ", "T"),
      };

      // 1. On récupère la nouvelle séance renvoyée par le serveur
      const createdRep = await representationApi.create(Number(id), payload);

      // 2. MISE À JOUR INSTANTANÉE DE L'INTERFACE 🚀
      if (show) {
        setShow({
          ...show,
          // On ajoute la nouvelle séance à la liste existante
          representations: [...(show.representations || []), createdRep],
        });
      }

      // Reset du champ date seulement
      setNewRep((prev) => ({ ...prev, when: "" }));

      setToast({ msg: t("producer.schedule.successAdd"), type: "success" });
    } catch (err) {
      setToast({ msg: t("producer.schedule.errorSave"), type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRep = async (repId: number) => {
    if (!window.confirm(t("producer.schedule.confirmDelete"))) return;
    try {
      await representationApi.delete(repId);
      await loadInitialData();
      // Utilise le toast ici aussi !
      setToast({ msg: "Séance supprimée avec succès", type: "success" });
    } catch (err) {
      setToast({ msg: t("producer.schedule.errorDelete"), type: "error" });
    }
  };

  if (loading)
    return (
      <div className={styles.loader}>{t("producer.schedule.loading")}</div>
    );
  if (!show) return <div>{t("producer.schedule.showNotFound")}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          {t("producer.schedule.back")}
        </button>
        <h1>{t("producer.schedule.title", { title: show.title })}</h1>
      </div>

      <div className={styles.grid}>
        {/* Liste à gauche */}
        <div className={styles.listSection}>
          <h3 className={styles.sectionTitle}>
            {t("producer.schedule.scheduledSessions")}
          </h3>
          {show.representations?.length === 0 ? (
            <p className={styles.empty}>{t("producer.schedule.empty")}</p>
          ) : (
            <div className={styles.repCardList}>
              {show.representations?.map((rep) => (
                <div key={rep.id} className={styles.repItem}>
                  <div className={styles.repInfo}>
                    <span className={styles.date}>
                      🗓{" "}
                      {formatDate(rep.when, i18n.language, {
                        day: "2-digit",
                        month: "long",
                      })}
                    </span>
                    <span className={styles.time}>
                      🕒 {formatTime(rep.when, i18n.language)}
                    </span>
                    <small style={{ color: "#888" }}>{rep.locationName}</small>
                  </div>
                  <div className={styles.priceBadges}>
                    {rep.prices?.map((p) => (
                      <span key={p.id} className={styles.badge}>
                        {p.type}: {formatCurrency(p.amount, i18n.language)}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleDeleteRep(rep.id)}
                    className={styles.deleteBtn}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formulaire à droite */}
        <div className={styles.formSection}>
          <form className={styles.repForm} onSubmit={handleSave}>
            <h3 className={styles.sectionTitle}>
              {t("producer.schedule.addSession")}
            </h3>

            <div className={styles.field}>
              <label>{t("producer.schedule.locationLabel")}</label>
              <select
                value={newRep.locationId}
                onChange={(e) =>
                  setNewRep({ ...newRep, locationId: Number(e.target.value) })
                }
                required
              >
                <option value="">
                  {t("producer.schedule.selectLocation")}
                </option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.designation}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label>{t("producer.schedule.dateTimeLabel")}</label>
              <input
                type="datetime-local"
                value={newRep.when}
                onChange={(e) => setNewRep({ ...newRep, when: e.target.value })}
                required
              />
            </div>

            <div className={styles.priceGrid}>
              <label className={styles.fullWidth}>
                {t("producer.schedule.priceGridLabel")}
              </label>
              {newRep.prices.map((p, index) => (
                <div key={p.type} className={styles.priceInputGroup}>
                  <span>{p.type}</span>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={p.amount}
                    onChange={(e) =>
                      handlePriceChange(index, Number(e.target.value))
                    }
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              className={styles.saveBtn}
              disabled={submitting}
            >
              {submitting
                ? t("producer.schedule.submitting")
                : t("producer.schedule.addToCalendar")}
            </button>
          </form>
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ShowSchedule;
