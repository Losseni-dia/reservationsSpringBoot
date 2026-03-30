import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./TermsAndPrivacy.module.css";

const TermsAndPrivacy: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{t("legal.title")}</h1>
        <p className={styles.lastUpdate}>{t("legal.lastUpdate")}</p>
      </header>

      <section className={styles.section}>
        <h2>{t("legal.cgu.title")}</h2>
        <div className={styles.content}>
          <h3>{t("legal.cgu.objectTitle")}</h3>
          <p>{t("legal.cgu.objectText")}</p>

          <h3>{t("legal.cgu.accountTitle")}</h3>
          <p>{t("legal.cgu.accountText")}</p>

          <h3>{t("legal.cgu.paymentTitle")}</h3>
          <p>{t("legal.cgu.paymentText")}</p>
        </div>
      </section>

      <hr className={styles.divider} />

      <section className={styles.section}>
        <h2>{t("legal.privacy.title")}</h2>
        <div className={styles.content}>
          <h3>{t("legal.privacy.dataTitle")}</h3>
          <p>{t("legal.privacy.dataText")}</p>

          <h3>{t("legal.privacy.rightsTitle")}</h3>
          <p>{t("legal.privacy.rightsText")}</p>

          <h3>{t("legal.privacy.cookiesTitle")}</h3>
          <p>{t("legal.privacy.cookiesText")}</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>
          {t("legal.contactText")} <strong>support@smartbooking.be</strong>
        </p>
      </footer>
    </div>
  );
};

export default TermsAndPrivacy;
