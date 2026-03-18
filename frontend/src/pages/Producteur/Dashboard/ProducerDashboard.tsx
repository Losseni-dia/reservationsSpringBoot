import React, { useEffect, useState } from "react";
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
import { Show, Reservation } from "../../../types/models";
import Loader from "../../../components/ui/loader/Loader";
import ConfirmModal from "../../../components/ui/confirmModal/ConfirmModal";
import Toast from "../../../components/ui/toast/Toast";
import styles from "./ProducerDashboard.module.css";
import ExportButton from '../../../components/ui/exportButton/ExportButton';
// Ajouter <ExportButton type="shows" label="Exporter mes spectacles" />

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
  icon?: React.ReactNode;
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const showsData = await showApi.getAll();
        setShows(showsData);

        // Simulate show stats and then calculate general stats from them
        const simulatedShowStats = calculateShowStats(showsData, []);
        calculateStats(showsData, simulatedShowStats);

        setError(null);
      } catch (err: any) {
        console.error("Erreur chargement dashboard:", err);
        setError(t("producer.dashboard.errorLoad"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  const calculateStats = (showsData: Show[], showStatsData: ShowStats[]) => {
    const totalShows = showsData.length;
    const ticketsSoldThisMonth = showStatsData.reduce(
      (sum, stat) => sum + stat.ticketsSold,
      0,
    );
    const totalRevenue = ticketsSoldThisMonth * 35.5;
    const upcomingEvents = showsData.filter((show) => show.bookable).length;

    setStats([
      { label: t("producer.dashboard.statTotalShows"), value: totalShows },
      {
        label: t("producer.dashboard.statTotalRevenue"),
        value: formatCurrency(totalRevenue, i18n.language),
      },
      { label: t("producer.dashboard.statTicketsSold"), value: ticketsSoldThisMonth },
      { label: t("producer.dashboard.statUpcomingEvents"), value: upcomingEvents },
    ]);
  };

  const calculateShowStats = (
    showsData: Show[],
    reservationsData: Reservation[],
  ): ShowStats[] => {
    const stats: { [key: number]: number } = {};

    // Placeholder, as we don't have reservation data.
    // We can simulate some data for demonstration.
    showsData.forEach((show) => {
      stats[show.id] = Math.floor(Math.random() * 200) + 50; // Random stats for demo
    });

    const result: ShowStats[] = showsData.map((show) => ({
      showId: show.id,
      showTitle: show.title,
      ticketsSold: stats[show.id] || 0,
    }));

    setShowsStats(result);
    return result;
  };

  const handleDeleteShow = (show: Show) => {
    setShowToDelete(show);
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setShowToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!showToDelete) return;

    // Sauvegarder l'état actuel pour rollback en cas d'erreur
    const previousShows = [...shows];
    const previousShowsStats = [...showsStats];
    const deletedShowTitle = showToDelete.title;

    // Suppression optimiste : retirer immédiatement de la liste
    const updatedShows = shows.filter((show) => show.id !== showToDelete.id);
    setShows(updatedShows);

    // Mettre à jour les stats immédiatement
    const updatedShowsStats = showsStats.filter(
      (stat) => stat.showId !== showToDelete.id,
    );
    setShowsStats(updatedShowsStats);
    calculateStats(updatedShows, updatedShowsStats);

    // Fermer la modale
    setIsDeleteModalOpen(false);
    setShowToDelete(null);

    try {
      // Appel API pour supprimer sur le backend
      await showApi.deleteById(showToDelete.id);

      // Succès : afficher toast
      setToastMessage(t("producer.dashboard.toastDeleteSuccess", { title: deletedShowTitle }));
    } catch (err: any) {
      // Erreur : rollback de l'état
      setShows(previousShows);
      setShowsStats(previousShowsStats);
      calculateStats(previousShows, previousShowsStats);

      // Déterminer le type d'erreur et afficher message approprié
      let errorMessage = t("producer.dashboard.errorDeleteGeneric");

      const errorText = err.message?.toLowerCase() || "";
      if (
        errorText.includes("reservation") ||
        errorText.includes("contrainte") ||
        errorText.includes("constraint") ||
        errorText.includes("foreign key") ||
        errorText.includes("référencé") ||
        errorText.includes("référence")
      ) {
        errorMessage = t("producer.dashboard.errorDeleteReservations", { title: deletedShowTitle });
      } else if (errorText.includes("network") || errorText.includes("fetch")) {
        errorMessage = t("producer.dashboard.errorNetwork");
      } else if (err.message) {
        errorMessage = err.message;
      }

      // Afficher toast d'erreur
      setToastMessage(errorMessage);
    }
  };

  if (loading) return <Loader />;

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
        hoverBackgroundColor: "rgba(0, 172, 193, 0.9)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: t("producer.dashboard.chartTitle"),
        color: "#e0e0e0",
        font: {
          size: 18,
        },
      },
      tooltip: {
        backgroundColor: "#2a2a2a",
        titleColor: "#ffffff",
        bodyColor: "#dddddd",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#444",
        },
        ticks: {
          color: "#aaa",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#aaa",
        },
      },
    },
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>{t("producer.dashboard.title")}</h1>
        <button
          onClick={() => navigate("/producer/shows/add")}
          className={styles.addShowButton}
        >
          {t("producer.dashboard.addShow")}
        </button>
      </header>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <section className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <StatCard key={index} label={stat.label} value={stat.value} />
        ))}
      </section>

      {showsStats.length > 0 && (
        <section className={styles.chartContainer}>
          <div style={{ height: "400px" }}>
            <Bar options={chartOptions as any} data={chartData} />
          </div>
        </section>
      )}

      <section className={styles.tableResponsive}>
        <table className={styles.showsTable}>
          <thead>
            <tr>
              <th>{t("producer.dashboard.colImage")}</th>
              <th>{t("producer.dashboard.colTitle")}</th>
              <th>{t("producer.dashboard.colCreatedAt")}</th>
              <th>{t("producer.dashboard.colTicketsSold")}</th>
              <th className={styles.actionsHeader}>{t("producer.dashboard.colActions")}</th>
            </tr>
          </thead>
          <tbody>
            {shows.length > 0 ? (
              shows.map((show) => {
                const showStat = showsStats.find((s) => s.showId === show.id);
                return (
                  <tr key={show.id}>
                    <td>
                      <img
                        src={`${IMAGE_STORAGE_BASE}${show.posterUrl}`}
                        alt={show.title}
                        className={styles.showImage}
                      />
                    </td>
                    <td>{show.title}</td>
                    <td>{formatDate(show.createdAt, i18n.language)}</td>
                    <td>{showStat?.ticketsSold || 0}</td>
                    <td>
                      <div className={styles.actionsContainer}>

                        {/* NOUVEAU BOUTON : GÉRER LES SÉANCES */}
                        <button
                          onClick={() => navigate(`/admin/shows/${show.id}/schedule`)}
                          className={`${styles.actionButton} ${styles.scheduleButton}`}
                          title={t("producer.dashboard.scheduleButtonTitle")}
                        >
                          {t("producer.dashboard.scheduleButton")}
                        </button>


                        <button
                          onClick={() =>
                            navigate(`/producer/shows/edit/${show.id}`)
                          }
                          className={`${styles.actionButton} ${styles.editButton}`}
                        >
                          {t("producer.dashboard.edit")}
                        </button>


                        <button
                          onClick={() => navigate(`/show/${show.id}`)}
                          className={`${styles.actionButton} ${styles.viewButton}`}
                        >
                          {t("producer.dashboard.view")}
                        </button>


                        <button
                          onClick={() => handleDeleteShow(show)}
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                        >
                          Supprimer
                        </button>

                        
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className={styles.noShows}>
                  {t("producer.dashboard.empty")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={t("producer.dashboard.modalTitle")}
        message={t("producer.dashboard.modalMessage", { title: showToDelete?.title })}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText={t("producer.dashboard.confirmText")}
        cancelText={t("producer.dashboard.cancelText")}
      />

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
};

export default ProducerDashboard;
