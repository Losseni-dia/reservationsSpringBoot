import { useTranslation } from "react-i18next";
import { FaStar, FaTicketAlt } from "react-icons/fa";
import { useAdminReservations } from "../../../hooks/useAdminReservations";
import Loader from "../../../components/ui/loader/Loader";
import AdminBackToDashboardButton from "../../../components/admin/AdminBackToDashboardButton";
import styles from "./AdminReservationPage.module.css";
import type { ReservationAdminDto, TicketDetailDto } from "../../../types/models";

function isVipCategory(category: string): boolean {
  return category.toUpperCase().includes("VIP");
}

function formatCell(
  value: string | null | undefined,
  fallback: string,
): string {
  if (value == null || value === "") return fallback;
  return value;
}

/** Date/heure ISO → libellé localisé (FR : 26/03/2026 à 09:25). */
function formatAdminDateTime(
  iso: string | null | undefined,
  language: string | undefined,
  fallback: string,
): string {
  if (iso == null || iso === "") return fallback;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return fallback;

  const primary = (language || "fr").toLowerCase().split("-")[0];

  if (primary === "fr") {
    const fmt = new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const parts = fmt.formatToParts(d);
    const get = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((p) => p.type === type)?.value ?? "";
    const day = get("day");
    const month = get("month");
    const year = get("year");
    const hour = get("hour");
    const minute = get("minute");
    if (!day || !month || !year || hour === "" || minute === "")
      return fmt.format(d).replace(/,\s*/, " à ");
    const hh = hour.padStart(2, "0");
    const mm = minute.padStart(2, "0");
    return `${day}/${month}/${year} à ${hh}:${mm}`;
  }

  try {
    return new Intl.DateTimeFormat(language || "fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
      hour12: false,
    }).format(d);
  } catch {
    return d.toLocaleString("fr-FR");
  }
}

export default function AdminReservationPage() {
  const { t, i18n } = useTranslation();
  const { reservations, loading, error, refetch } = useAdminReservations();

  const formatEur = (amount: number) =>
    new Intl.NumberFormat(i18n.language || "fr", {
      style: "currency",
      currency: "EUR",
    }).format(amount);

  const ticketDetailsCell = (row: ReservationAdminDto) => {
    const details = row.ticketDetails;
    if (!details?.length)
      return <span className="text-secondary small">{dash}</span>;
    return (
      <div className="d-flex flex-column gap-1">
        {details.map((d: TicketDetailDto, i: number) => {
          const vip = isVipCategory(d.category);
          return (
            <div
              key={`${row.id}-${d.category}-${i}`}
              className={`d-flex align-items-center gap-2 small ${vip ? styles.ticketLineVip : styles.ticketLineDefault}`}
            >
              <span className={styles.ticketIconWrap} aria-hidden>
                {vip ? <FaStar /> : <FaTicketAlt />}
              </span>
              <span className={styles.ticketLineText}>
                {d.quantity}x {d.category}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const showSessionCell = (row: ReservationAdminDto) => {
    const title = row.showTitle;
    const whenFormatted = formatAdminDateTime(
      row.representationWhen,
      i18n.language,
      t("admin.reservations.noValue"),
    );
    const whenIsEmpty =
      !row.representationWhen ||
      whenFormatted === t("admin.reservations.noValue");
    if (!title && whenIsEmpty) return t("admin.reservations.noValue");
    if (title && !whenIsEmpty) return `${title} — ${whenFormatted}`;
    return title || whenFormatted;
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <p className="text-light text-center mb-3">
          {t("admin.reservations.loading")}
        </p>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <AdminBackToDashboardButton />
        <div className={styles.errorBox} role="alert">
          <p className="text-danger mb-3">{t("admin.reservations.error")}</p>
          <p className="text-secondary small mb-3">{error}</p>
          <button
            type="button"
            className="btn btn-warning"
            onClick={() => refetch()}
          >
            {t("admin.reservations.retry")}
          </button>
        </div>
      </div>
    );
  }

  const dash = t("admin.reservations.noValue");

  return (
    <div className={styles.container}>
      <AdminBackToDashboardButton />

      <header className={styles.header}>
        <h1 className="mb-0">
          {t("admin.reservations.title")}{" "}
          <span className={styles.yellow}>
            {t("admin.reservations.titleHighlight")}
          </span>
        </h1>
        <p className="text-secondary mt-2 mb-0">
          {t("admin.reservations.subtitle", { count: reservations.length })}
        </p>
      </header>

      <div className={`table-responsive ${styles.tableOuter}`}>
        <table className="table table-dark table-striped table-hover align-middle mb-0">
          <thead>
            <tr>
              <th scope="col">{t("admin.reservations.colId")}</th>
              <th scope="col">{t("admin.reservations.colDate")}</th>
              <th scope="col">{t("admin.reservations.colUser")}</th>
              <th scope="col">{t("admin.reservations.colShowSession")}</th>
              <th scope="col">{t("admin.reservations.colTicketDetails")}</th>
              <th scope="col" className="text-end">
                {t("admin.reservations.colTotal")}
              </th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-secondary py-5">
                  {t("admin.reservations.empty")}
                </td>
              </tr>
            ) : (
              reservations.map((row) => (
                <tr key={row.id}>
                  <td>
                    <code className={styles.idCode}>{row.id}</code>
                  </td>
                  <td className={styles.mutedCell}>
                    {formatAdminDateTime(
                      row.reservationDate,
                      i18n.language,
                      dash,
                    )}
                  </td>
                  <td>
                    <div className={styles.userCell}>
                      <span className="fw-semibold">
                        {formatCell(row.userLogin, dash)}
                      </span>
                      <span className={styles.userEmail}>
                        {formatCell(row.userEmail, dash)}
                      </span>
                    </div>
                  </td>
                  <td className={styles.mutedCell}>{showSessionCell(row)}</td>
                  <td>{ticketDetailsCell(row)}</td>
                  <td className={`text-end fw-semibold ${styles.amountCell}`}>
                    {formatEur(row.totalAmount ?? 0)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
