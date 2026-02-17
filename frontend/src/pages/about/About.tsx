import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./About.module.css";

const About: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.overlay}>
          <h1 className={styles.title}>
            {t("about.heroTitle")}<span>{t("about.heroTitleBrand")}</span>{t("about.heroTitleSuffix")}
          </h1>
          <p className={styles.subtitle}>
            {t("about.heroSubtitle")}
          </p>
          <button className={styles.ctaPrimary} onClick={() => navigate("/")}>
            {t("about.ctaDiscover")}
          </button>
        </div>
      </section>

      {/* NOS VALEURS */}
      <section className={styles.sectionDark}>
        <h2 className={styles.sectionTitle}>{t("about.sectionValues")}</h2>
        <div className={styles.cardGrid}>
          <div className={styles.valueCard}>
            <div className={styles.icon}>🎭</div>
            <h3>{t("about.valuePassion")}</h3>
            <p>{t("about.valuePassionDesc")}</p>
          </div>
          <div className={`${styles.valueCard} ${styles.activeCard}`}>
            <div className={styles.icon}>👥</div>
            <h3>{t("about.valueTalents")}</h3>
            <p>{t("about.valueTalentsDesc")}</p>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.icon}>🤝</div>
            <h3>{t("about.valueCommunity")}</h3>
            <p>{t("about.valueCommunityDesc")}</p>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.icon}>🌍</div>
            <h3>{t("about.valueDiversity")}</h3>
            <p>{t("about.valueDiversityDesc")}</p>
          </div>
        </div>
      </section>

      {/* AVIS SPECTATEURS */}
      <section className={styles.sectionLight}>
        <h2 className={styles.sectionTitleDark}>{t("about.sectionReviews")}</h2>
        <div className={styles.reviewGrid}>
          <div className={styles.reviewCard}>
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop" 
              alt={t("about.author1")} 
              className={styles.avatar} 
            />
            <p>{t("about.review1")}</p>
            <div className={styles.stars}>★★★★★</div>
            <span className={styles.author}>- {t("about.author1")}</span>
          </div>
          
          <div className={styles.reviewCardWide}>
            <div className={styles.reviewImage}></div>
            <div className={styles.reviewContent}>
              <p>{t("about.review2")}</p>
              <div className={styles.stars}>★★★★★</div>
              <span className={styles.author}>- {t("about.author2")}</span>
              <button className={styles.miniCta}>{t("about.reserve")}</button>
            </div>
          </div>
        </div>
      </section>

      {/* NOS COUPS DE COEUR */}
      <section className={styles.sectionDark}>
        <h2 className={styles.sectionTitle}>{t("about.sectionFavorites")}</h2>
        <div className={styles.showGrid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.showCard}>
              <div className={styles.showImagePlaceholder}></div>
              <div className={styles.showInfo}>
                <h4>{t("about.showEvent")} {i}</h4>
                <p>{t("about.theatreNational")}</p>
                <button className={styles.btnOutline}>{t("about.seeMore")}</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
