import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { showApi, IMAGE_STORAGE_BASE } from "../../../services/api";
import { formatDate, formatCurrency } from "../../../utils/format";
import { Show } from "../../../types/models";
import Loader from "../../../components/ui/loader/Loader";
import ConfirmModal from "../../../components/ui/confirmModal/ConfirmModal";
import Toast from "../../../components/ui/toast/Toast";
import styles from "./ProducerDashboard.module.css";
import ExportButton from "../../../components/ui/exportButton/ExportButton";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface StatCardProps {
  label: string;
  value: string | number;
}

interface ShowStats {
  showId: number;
  showTitle: string;
  ticketsSold: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => (
  <div className={styles.statCard}>
    <div className={styles.statLabel}>{label}</div>
    <div className={styles.statValue}>{value}</div>
  </div>
);

const ProducerDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatCardProps[]>([]);
  const [showsStats, setShowsStats] = useState<ShowStats[]>([]);
  const [showToDelete, setShowToDelete] = useState<Show | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- LOGIQUE DE CALCUL DES STATISTIQUES RÉELLES ---

  const calculateShowStats = useCallback((showsData: Show[]): ShowStats[] => {
    const result: ShowStats[] = showsData.map((show) => {
      // Somme des billets vendus sur toutes les représentations du spectacle
      const totalSold =
        show.representations?.reduce(
          (sum, rep) => sum + (rep.ticketsSold || 0),
          0,
        ) || 0;
      return {
        showId: show.id,
        showTitle: show.title,
        ticketsSold: totalSold,
      };
    });
    setShowsStats(result);
    return result;
  }, []);

  const calculateTotalStats = useCallback(
    (showsData: Show[], showStatsData: ShowStats[]) => {
      const totalShows = showsData.length;
      const totalTicketsSold = showStatsData.reduce(
        (sum, stat) => sum + stat.ticketsSold,
        0,
      );

      // Estimation du revenu (Tickets * prix moyen de 25€ ou calcul plus précis si dispo)
      const totalRevenue = totalTicketsSold * 25;
      const upcomingEvents = showsData.filter((show) => show.bookable).length;

      setStats([
        { label: t("producer.dashboard.statTotalShows"), value: totalShows },
        {
          label: t("producer.dashboard.statTotalRevenue"),
          value: formatCurrency(totalRevenue, i18n.language),
        },
        {
          label: t("producer.dashboard.statTicketsSold"),
          value: totalTicketsSold,
        },
        {
          label: t("producer.dashboard.statUpcomingEvents"),
          value: upcomingEvents,
        },
      ]);
    },
    [t, i18n.language],
  );

  // --- CHARGEMENT DES DONNÉES ---

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const showsData = await showApi.getMyShows();
      setShows(showsData);

      const realShowStats = calculateShowStats(showsData);
      calculateTotalStats(showsData, realShowStats);

      setError(null);
    } catch (err: any) {
      console.error("Erreur chargement dashboard:", err);
      setError(t("producer.dashboard.errorLoad"));
    } finally {
      setLoading(false);
    }
  }, [t, calculateShowStats, calculateTotalStats]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- ACTIONS ---

  const handleConfirmDelete = async () => {
    if (!showToDelete) return;

    const previousShows = [...shows];
    const previousShowsStats = [...showsStats];
    const deletedShowTitle = showToDelete.title;

    // Mise à jour optimiste
    const updatedShows = shows.filter((s) => s.id !== showToDelete.id);
    const updatedShowsStats = showsStats.filter(
      (s) => s.showId !== showToDelete.id,
    );

    setShows(updatedShows);
    setShowsStats(updatedShowsStats);
    calculateTotalStats(updatedShows, updatedShowsStats);

    setIsDeleteModalOpen(false);
    setShowToDelete(null);

    try {
      await showApi.deleteById(showToDelete.id);
      setToastMessage(
        t("producer.dashboard.toastDeleteSuccess", { title: deletedShowTitle }),
      );
    } catch (err: any) {
      // Rollback en cas d'échec
      setShows(previousShows);
      setShowsStats(previousShowsStats);
      calculateTotalStats(previousShows, previousShowsStats);
      setToastMessage(t("producer.dashboard.errorDeleteGeneric"));
    }
  };

  if (loading) return <Loader />;

  // --- CONFIGURATION GRAPHIQUE ---

  const chartData = {
    labels: showsStats.map((s) => s.showTitle),
    datasets: [
      {
        label: t("producer.dashboard.chartLabel"),
        data: showsStats.map((s) => s.ticketsSold),
        backgroundColor: "rgba(0, 172, 193, 0.6)",
        borderColor: "rgba(0, 172, 193, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>
          {t("producer.dashboard.title")}
        </h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={() => navigate("/producer/shows/add")}
            className={styles.addShowButton}
          >
            {t("producer.dashboard.addShow")}
          </button>
          <ExportButton type="shows" label="Exporter" />
        </div>
      </header>

      <section className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <StatCard key={index} label={stat.label} value={stat.value} />
        ))}
      </section>

      {showsStats.length > 0 && (
        <section className={styles.chartContainer}>
          <div style={{ height: "350px" }}>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  title: {
                    display: true,
                    text: t("producer.dashboard.chartTitle"),
                    color: "#fff",
                  },
                },
              }}
            />
          </div>
        </section>
      )}

      <section className={styles.tableResponsive}>
        <table className={styles.showsTable}>
          <thead>
            <tr>
              <th>{t("producer.dashboard.colImage")}</th>
              <th>{t("producer.dashboard.colTitle")}</th>
              <th>{t("producer.dashboard.colTicketsSold")}</th>
              <th>{t("producer.dashboard.colActions")}</th>
            </tr>
          </thead>
          <tbody>
            {shows.map((show) => (
              <tr key={show.id}>
                <td>
                  <img
                    src={`${IMAGE_STORAGE_BASE}${show.posterUrl}`}
                    className={styles.showImage}
                    alt=""
                  />
                </td>
                <td>{show.title}</td>
                <td>
                  {showsStats.find((s) => s.showId === show.id)?.ticketsSold ||
                    0}
                </td>
                <td className={styles.actionsContainer}>
                  {/* BOUTON : GÉRER LES SÉANCES */}
                  <button
                    onClick={() => navigate(`/admin/shows/${show.id}/schedule`)}
                    className={`${styles.actionButton} ${styles.scheduleButton}`}
                  >
                    {t("producer.dashboard.scheduleButton")}
                  </button>

                  {/* BOUTON : MODIFIER */}
                  <button
                    onClick={() => navigate(`/producer/shows/edit/${show.id}`)}
                    className={`${styles.actionButton} ${styles.editButton}`}
                  >
                    ✏️ {t("producer.dashboard.edit")}
                  </button>

                  {/* BOUTON : SUPPRIMER */}
                  <button
                    onClick={() => {
                      setShowToDelete(show);
                      setIsDeleteModalOpen(true);
                    }}
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                  >
                    🗑 {t("producer.dashboard.delete") || "Supprimer"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={t("producer.dashboard.modalTitle")}
        message={t("producer.dashboard.modalMessage", {
          title: showToDelete?.title,
        })}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
};

export default ProducerDashboard;
