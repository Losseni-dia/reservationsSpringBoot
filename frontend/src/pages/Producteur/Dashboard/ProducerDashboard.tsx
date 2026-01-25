import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Show, Reservation } from "../../../types/models";
import Loader from "../../../components/ui/loader/Loader";
import ConfirmModal from "../../../components/ui/confirmModal/ConfirmModal";
import Toast from "../../../components/ui/toast/Toast";
import styles from "./ProducerDashboard.module.css";

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
        setError(
          "Impossible de charger les données. Veuillez réessayer plus tard.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateStats = (showsData: Show[], showStatsData: ShowStats[]) => {
    const totalShows = showsData.length;

    // Calculate total revenue and tickets sold based on simulated stats
    const ticketsSoldThisMonth = showStatsData.reduce(
      (sum, stat) => sum + stat.ticketsSold,
      0,
    );
    // Simulate revenue: assume an average ticket price of $35.5
    const totalRevenue = ticketsSoldThisMonth * 35.5;

    const upcomingEvents = showsData.filter((show) => show.bookable).length;

    setStats([
      { label: "Spectacles au total", value: totalShows },
      {
        label: "Revenu Total (Démo)",
        value: `$${totalRevenue.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      },
      { label: "Billets Vendus (Démo)", value: ticketsSoldThisMonth },
      { label: "Événements à Venir", value: upcomingEvents },
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

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("fr-FR");

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
      setToastMessage(
        `Le spectacle "${deletedShowTitle}" a été supprimé avec succès.`,
      );
    } catch (err: any) {
      // Erreur : rollback de l'état
      setShows(previousShows);
      setShowsStats(previousShowsStats);
      calculateStats(previousShows, previousShowsStats);

      // Déterminer le type d'erreur et afficher message approprié
      let errorMessage = "Une erreur est survenue lors de la suppression.";

      // Vérifier si c'est une erreur de contrainte (spectacle avec réservations)
      const errorText = err.message?.toLowerCase() || "";
      if (
        errorText.includes("reservation") ||
        errorText.includes("contrainte") ||
        errorText.includes("constraint") ||
        errorText.includes("foreign key") ||
        errorText.includes("référencé") ||
        errorText.includes("référence")
      ) {
        errorMessage = `Impossible de supprimer "${deletedShowTitle}" : ce spectacle possède des réservations actives. Veuillez annuler toutes les réservations avant de supprimer le spectacle.`;
      } else if (errorText.includes("network") || errorText.includes("fetch")) {
        errorMessage =
          "Erreur de connexion. Vérifiez votre connexion internet et réessayez.";
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
        label: "Billets Vendus",
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
        text: "Performance des Spectacles (Billets Vendus)",
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
        <h1 className={styles.dashboardTitle}>Tableau de bord du Producteur</h1>
        <button
          onClick={() => navigate("/producer/shows/add")}
          className={styles.addShowButton}
        >
          + Ajouter un spectacle
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
              <th>Image</th>
              <th>Titre</th>
              <th>Date de Création</th>
              <th>Billets Vendus (Démo)</th>
              <th className={styles.actionsHeader}>Actions</th>
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
                    <td>{formatDate(show.createdAt)}</td>
                    <td>{showStat?.ticketsSold || 0}</td>
                    <td>
                      <div className={styles.actionsContainer}>

                        {/* NOUVEAU BOUTON : GÉRER LES SÉANCES */}
                        <button
                          onClick={() => navigate(`/admin/shows/${show.id}/schedule`)}
                          className={`${styles.actionButton} ${styles.scheduleButton}`}
                          title="Gérer le calendrier et les prix"
                        >
                          📅 Séances
                        </button>


                        <button
                          onClick={() =>
                            navigate(`/producer/shows/edit/${show.id}`)
                          }
                          className={`${styles.actionButton} ${styles.editButton}`}
                        >
                          Modifier
                        </button>


                        <button
                          onClick={() => navigate(`/show/${show.id}`)}
                          className={`${styles.actionButton} ${styles.viewButton}`}
                        >
                          Voir
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
                  Aucun spectacle à afficher.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer le spectacle "${showToDelete?.title}" ? Cette action est irréversible.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Supprimer"
        cancelText="Annuler"
      />

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
};

export default ProducerDashboard;
