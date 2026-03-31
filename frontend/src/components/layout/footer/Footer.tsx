import React from "react";
import { FaRss } from "react-icons/fa";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // 1. Import du hook

const Footer: React.FC = () => {
  const { t } = useTranslation(); // 2. Initialisation de la fonction t
  const rssUrl = "http://localhost:8080/api/rss";

  return (
    <footer className={styles.footer}>
      <div className="container text-center">
        <div className={styles.socials}>
          <span>FB</span> <span>IG</span> <span>TW</span>
        </div>

        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()}{" "}
          <span className={styles.yellow}>SmartBooking</span>.{" "}
          {t("layout.footer.allRightsReserved")}
        </p>

        <div className={styles.links}>
          {/* 3. Appel correct de la traduction */}
          <Link to="/terms">{t("layout.footer.terms")}</Link>

          <a
            href={rssUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={t("layout.footer.rssTitle") || "S'abonner au flux RSS"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              color: "orange",
              textDecoration: "none",
            }}
          >
            <FaRss size={18} style={{ marginRight: "5px" }} />
            {t("layout.footer.rssLink") || "Flux RSS"}
          </a>

          <Link
            to="/developers"
            style={{ color: "#aaa", textDecoration: "none" }}
          >
            {t("layout.footer.devs") || "API & Développeurs"}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
