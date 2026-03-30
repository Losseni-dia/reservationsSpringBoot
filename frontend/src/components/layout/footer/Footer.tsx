<<<<<<< HEAD
// Chemin : src/components/layout/Footer.tsx
=======
>>>>>>> origin
import React from "react";
import { FaRss } from "react-icons/fa";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";
<<<<<<< HEAD
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const rssUrl = "http://localhost:8080/api/rss";
=======
import { useTranslation } from "react-i18next"; // 1. Import du hook

const Footer: React.FC = () => {
  const { t } = useTranslation(); // 2. Initialisation de la fonction t
  const rssUrl = "http://localhost:8080/api/rss";

>>>>>>> origin
  return (
    <footer className={styles.footer}>
      <div className="container text-center">
        <div className={styles.socials}>
<<<<<<< HEAD
          <span>{t("layout.footer.socialFb")}</span>{" "}
          <span>{t("layout.footer.socialIg")}</span>{" "}
          <span>{t("layout.footer.socialTw")}</span>
        </div>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()}{" "}
          <span className={styles.yellow}>{t("layout.footer.brandName")}</span>.{" "}
          {t("layout.footer.allRightsReserved")}
        </p>
        <div className={styles.links}>
          <a href="#">{t("layout.footer.privacy")}</a>
          <a href="#">{t("layout.footer.terms")}</a>
=======
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

>>>>>>> origin
          <a
            href={rssUrl}
            target="_blank"
            rel="noopener noreferrer"
<<<<<<< HEAD
            title={t("layout.footer.rssSubscribeTitle")}
=======
            title={t("layout.footer.rssTitle") || "S'abonner au flux RSS"}
>>>>>>> origin
            style={{
              display: "inline-flex",
              alignItems: "center",
              color: "orange",
<<<<<<< HEAD
            }}
          >
            <FaRss size={18} />
            {t("layout.footer.rssLink")}
          </a>
          <li>
            <Link
              to="/developers"
              style={{ color: "#aaa", textDecoration: "none" }}
            >
              {t("layout.footer.developers")}
            </Link>
          </li>
=======
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
>>>>>>> origin
        </div>
      </div>
    </footer>
  );
};

export default Footer;
