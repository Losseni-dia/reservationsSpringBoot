import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAdminReservations } from "../../../hooks/useAdminReservations";
import Loader from "../../../components/ui/loader/Loader";
import styles from "./AdminReservationPage.module.css";
import type { ReservationAdminDto } from "../../../types/models";

function formatCell(
  value: string | null | undefined,
  fallback: string,
): string {
  if (value == null || value === "") return fallback;
  return value;
}

export default function AdminReservationPage() {
  const { t, i18n } = useTranslation();
  const { reservations, loading, error, refetch } = useAdminReservations();

  const formatEur = (amount: number) =>
    new Intl.NumberFormat(i18n.language || "fr", {
      style: "currency",
      currency: "EUR",
    }).format(amount);

  const statusLabel = (row: ReservationAdminDto) => {
    const s = row.statut;
    if (!s) return t("admin.reservations.noValue");
    return t(`admin.reservations.status.${s}`, { defaultValue: s });
  };

  const showSessionCell = (row: ReservationAdminDto) => {
    const title = row.showTitle;
    const when = row.representationWhen;
    if (!title && !when) return t("admin.reservations.noValue");
    if (title && when) return `${title} — ${when}`;
    return title || when || t("admin.reservations.noValue");
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
        <Link to="/admin" className={styles.backLink}>
          {t("admin.reservations.backToDashboard")}
        </Link>
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
      <Link to="/admin" className={styles.backLink}>
        {t("admin.reservations.backToDashboard")}
      </Link>

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
              <th scope="col">{t("admin.reservations.colStatus")}</th>
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
                    {formatCell(row.reservationDate, dash)}
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
                  <td>
                    <span className={styles.statusBadge}>{statusLabel(row)}</span>
                  </td>
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
