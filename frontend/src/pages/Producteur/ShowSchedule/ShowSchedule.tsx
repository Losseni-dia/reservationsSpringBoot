import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { showApi, representationApi, locationApi } from "../../../services/api";
import {
  formatDate,
  formatTime,
  formatCurrency,
  getCurrencySymbol,
} from "../../../utils/format";
import { TypePrice } from "../../../types/enums";
import { Show, Location } from "../../../types/models";
import styles from "./ShowSchedule.module.css";
import Toast from "../../../components/ui/toast/Toast";
import { HiCalendarDays } from "react-icons/hi2";

/** Retire les zéros de tête avant un chiffre ("020" → "20") sans altérer "0.5". */
function stripLeadingZerosBeforeDigits(raw: string): string {
  return raw.replace(/^0+(?=\d)/, "");
}

/** Valeur affichée dans l’input → montant API (≥ 0). */
function amountStrToNumber(s: string): number {
  const t = s.trim();
  if (t === "" || t === ".") return 0;
  const n = parseFloat(t);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

const ShowSchedule: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [show, setShow] = useState<Show | null>(null);
  const [locations, setLocations] = useState<Location[]>([]); // Liste des lieux pour le select
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const getNowDateTimeString = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const minDateTime = getNowDateTimeString();
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  // État pour la nouvelle séance
  const [newRep, setNewRep] = useState({
    when: "",
    locationId: "" as number | "",
    prices: [
      { type: TypePrice.STANDARD, amountStr: "0" },
      { type: TypePrice.REDUIT, amountStr: "0" },
      { type: TypePrice.VIP, amountStr: "0" },
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

  const handlePriceInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let v = e.target.value;
    setNewRep((prev) => {
      const prices = [...prev.prices];
      if (v === "") {
        prices[index] = { ...prices[index], amountStr: "" };
        return { ...prev, prices };
      }
      v = stripLeadingZerosBeforeDigits(v);
      prices[index] = { ...prices[index], amountStr: v };
      return { ...prev, prices };
    });
  };

  const handlePriceInputBlur = (index: number) => {
    setNewRep((prev) => {
      const prices = [...prev.prices];
      const s = prices[index].amountStr.trim();
      if (s === "" || s === ".") {
        prices[index] = { ...prices[index], amountStr: "0" };
      }
      return { ...prev, prices };
    });
  };

const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();

  // 1. Vérification des champs vides
  if (!id || !newRep.when || !newRep.locationId) {
    setToast({
      msg: t("producer.schedule.alertFillDateLocation"),
      type: "error",
    });
    return;
  }

  // 2. 🛡️ Validation "Pas de passé"
  const selectedDate = new Date(newRep.when);
  const now = new Date();
  if (selectedDate < now) {
    setToast({
      msg: "Vous ne pouvez pas programmer une séance dans le passé",
      type: "error",
    });
    return;
  }

  const pricesPayload = newRep.prices.map((p) => ({
    type: p.type,
    amount: amountStrToNumber(p.amountStr),
  }));

  setSubmitting(true);
  try {
    const payload = {
      when: newRep.when.replace(" ", "T"),
      locationId: Number(newRep.locationId),
      prices: pricesPayload,
    };

    const createdRep = await representationApi.create(Number(id), payload);

    if (show) {
      setShow({
        ...show,
        representations: [...(show.representations || []), createdRep],
      });
    }

    setNewRep((prev) => ({
      ...prev,
      when: "",
      prices: prev.prices.map((row) => ({
        ...row,
        amountStr: String(amountStrToNumber(row.amountStr)),
      })),
    }));
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
              <label htmlFor="session-datetime">
                {t("producer.schedule.dateTimeLabel")}
              </label>
              <div className={styles.dateTimeWrap}>
                <span className={styles.dateTimeIcon} aria-hidden>
                  <HiCalendarDays />
                </span>
                <input
                  id="session-datetime"
                  type="datetime-local"
                  className={styles.dateTimeInput}
                  value={newRep.when}
                  min={minDateTime}
                  onChange={(e) =>
                    setNewRep({ ...newRep, when: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className={styles.priceGrid}>
              <label className={styles.priceGridTitle}>
                {t("producer.schedule.priceGridLabel")}
              </label>
              {newRep.prices.map((p, index) => (
                <div key={p.type} className={styles.priceInputGroup}>
                  <span className={styles.priceTypeLabel}>{p.type}</span>
                  <div className={styles.priceInputWrap}>
                    <input
                      type="number"
                      min={0}
                      step={0.5}
                      className={styles.priceInput}
                      value={p.amountStr}
                      onChange={(e) => handlePriceInputChange(index, e)}
                      onBlur={() => handlePriceInputBlur(index)}
                      aria-label={`${p.type} (${getCurrencySymbol(i18n.language)})`}
                    />
                    <span className={styles.currencySuffix} aria-hidden>
                      {getCurrencySymbol(i18n.language)}
                    </span>
                  </div>
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
