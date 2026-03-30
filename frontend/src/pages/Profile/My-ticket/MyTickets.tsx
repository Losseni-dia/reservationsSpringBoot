import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ticketApi } from "../../../services/api";
import { TicketDetail } from "../../../types/models";
import { formatDate, formatTime, formatCurrency } from "../../../utils/format";
import { useTranslation } from "react-i18next";
import styles from "./MyTickets.module.css";

const MyTickets: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [tickets, setTickets] = useState<TicketDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ticketApi
      .getMyTickets()
      .then((data) => {
        console.log("🎟️ Données reçues du serveur :", data); // Pour vérifier les noms des champs
        setTickets(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className={styles.loader}>{t("common.loading")}</div>;

  if (tickets.length === 0) {
    return <div className={styles.empty}>{t("profile.noTickets")}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("profile.myTicketsTitle")}</h2>
      <div className={styles.ticketGrid}>
        {tickets.map((ticket) => (
          <div key={ticket.id} className={styles.ticketCard}>
            {/* Partie Gauche : Infos du Spectacle */}
            <div className={styles.infoSection}>
              <div className={styles.showHeader}>
                <span className={styles.categoryBadge}>
                  {ticket.category || "STANDARD"}
                </span>
                <h3 className={styles.showTitle}>
                  {ticket.showTitle || "Titre non disponible"}
                </h3>
              </div>

              <div className={styles.details}>
                <div className={styles.detailItem}>
                  <span className={styles.icon}>📍</span>
                  <span>{ticket.locationName || "Lieu non précisé"}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.icon}>📅</span>
                  <span>{formatDate(ticket.date, i18n.language)}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.icon}>🕒</span>
                  <span>{formatTime(ticket.date, i18n.language)}</span>
                </div>
              </div>

              <div className={styles.footerInfo}>
                <div className={styles.priceTag}>
                  {formatCurrency(ticket.price, i18n.language)}
                </div>
              </div>
            </div>

            {/* Séparateur Pointillé */}
            <div className={styles.divider}></div>

            {/* Partie Droite : QR Code */}
            <div className={styles.qrSection}>
              <div className={styles.qrWrapper}>
                <QRCodeSVG
                  value={ticket.qrCodeReference}
                  size={100}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className={styles.refLabel}>RÉFÉRENCE</p>
              <code className={styles.refCode}>
                {ticket.qrCodeReference.substring(0, 8).toUpperCase()}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTickets;
