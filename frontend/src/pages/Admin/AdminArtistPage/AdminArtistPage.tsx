import { useTranslation } from "react-i18next";
import { useAdminArtists } from "../../../hooks/useAdminArtists";
import Loader from "../../../components/ui/loader/Loader";
import AdminBackToDashboardButton from "../../../components/admin/AdminBackToDashboardButton";
import styles from "./AdminArtistPage.module.css";

export default function AdminArtistPage() {
  const { t } = useTranslation();
  const { artists, loading, error, refetch } = useAdminArtists();

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <p className="text-light text-center mb-3">{t("admin.artists.loading")}</p>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <AdminBackToDashboardButton />
        <div className={styles.errorBox} role="alert">
          <p className="text-danger mb-3">{t("admin.artists.error")}</p>
          <p className="text-secondary small mb-3">{error}</p>
          <button
            type="button"
            className="btn btn-warning"
            onClick={() => refetch()}
          >
            {t("admin.artists.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AdminBackToDashboardButton />

      <header className={styles.header}>
        <h1 className="mb-0">
          {t("admin.artists.title")}{" "}
          <span className={styles.yellow}>{t("admin.artists.titleHighlight")}</span>
        </h1>
        <p className="text-secondary mt-2 mb-0">
          {t("admin.artists.subtitle", { count: artists.length })}
        </p>
      </header>

      <div className={`table-responsive ${styles.tableOuter}`}>
        <table className="table table-dark table-striped table-hover align-middle mb-0">
          <thead>
            <tr>
              <th scope="col">{t("admin.artists.colId")}</th>
              <th scope="col">{t("admin.artists.colFirstname")}</th>
              <th scope="col">{t("admin.artists.colLastname")}</th>
              <th scope="col">{t("admin.artists.colTypes")}</th>
            </tr>
          </thead>
          <tbody>
            {artists.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-secondary py-5">
                  {t("admin.artists.empty")}
                </td>
              </tr>
            ) : (
              artists.map((artist) => (
                <tr key={artist.id}>
                  <td>
                    <code className={styles.idCode}>{artist.id}</code>
                  </td>
                  <td>{artist.firstname}</td>
                  <td className="fw-semibold">{artist.lastname}</td>
                  <td className={styles.typesCell}>
                    {artist.types?.length
                      ? artist.types.join(", ")
                      : t("admin.artists.noTypes")}
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
