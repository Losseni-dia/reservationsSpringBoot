import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiArrowLeft } from "react-icons/hi";

type Props = {
  className?: string;
};

/**
 * Retour cohérent vers le tableau de bord admin (thème sombre / accent doré).
 */
export default function AdminBackToDashboardButton({ className = "" }: Props) {
  const { t } = useTranslation();
  return (
    <Link
      to="/admin"
      className={`btn btn-outline-warning d-inline-flex align-items-center gap-2 mb-3 text-decoration-none ${className}`.trim()}
    >
      <HiArrowLeft className="flex-shrink-0" aria-hidden />
      <span>{t("admin.common.backToDashboard")}</span>
    </Link>
  );
}
