// Chemin : src/components/layout/Footer.tsx
import React from "react";
import { FaRss } from "react-icons/fa";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const rssUrl = "http://localhost:8080/api/rss";
  return (
    <footer className={styles.footer}>
      <div className="container text-center">
        <div className={styles.socials}>
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
          <a
            href={rssUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={t("layout.footer.rssSubscribeTitle")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              color: "orange",
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
