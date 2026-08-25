import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { showApi } from "../../services/api";
import { Show } from "../../types/models";
import Loader from "../../components/ui/loader/Loader";
import styles from "./About.module.css";

const About: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [topShows, setTopShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopShows = async () => {
      try {
        const allShows = await showApi.getAll();
        const bestRated = [...allShows]
          .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
          .slice(0, 3);
        setTopShows(bestRated);
      } catch (error) {
        console.error("Erreur chargement coups de cœur:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopShows();
  }, []);

  return (
    <div className={styles.container}>
      {/* SECTION HERO */}
      <section className={styles.hero}>
        <div className={styles.overlay}>
          <h1 className={styles.title}>
            {t("about.heroTitle")}
            <span>{t("about.heroTitleBrand")}</span>
          </h1>
          <p className={styles.subtitle}>{t("about.heroSubtitle")}</p>
          <div className={styles.heroBtns}>
            <button className={styles.ctaPrimary} onClick={() => navigate("/")}>
              {t("about.ctaDiscover")}
            </button>
          </div>
        </div>
      </section>

      {/* SECTION CHIFFRES CLÉS (Nouveau) */}
      <section className={styles.statsSection}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>45k+</span>
          <p>{t("about.statsTickets")}</p>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>150+</span>
          <p>{t("about.statsVenues")}</p>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>98%</span>
          <p>{t("about.statsSatisfaction")}</p>
        </div>
      </section>

      {/* SECTION NOTRE MISSION (Nouveau) */}
      <section className={styles.missionSection}>
        <div className={styles.missionContent}>
          <h2 className={styles.sectionTitleLeft}>{t("about.missionTitle")}</h2>
          <p className={styles.missionText}>{t("about.missionDesc")}</p>
        </div>
        <div className={styles.missionImage}></div>
      </section>

      {/* SECTION NOS VALEURS */}
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

      {/* SECTION COUPS DE COEUR */}
      <section className={styles.sectionFavorites}>
        <h2 className={styles.sectionTitle}>
          ✨ {t("about.sectionFavorites")}
        </h2>
        {loading ? (
          <Loader />
        ) : (
          <div className={styles.showGrid}>
            {topShows.map((show, index) => (
              <div key={show.id} className={styles.showCard}>
                {index === 0 && <div className={styles.topBadge}>TOP 1</div>}
                <div
                  className={styles.showImagePlaceholder}
                  style={{
                    backgroundImage: show.posterUrl
                      ? `url(${show.posterUrl})`
                      : "none",
                  }}
                >
                  {!show.posterUrl && "🎭"}
                </div>
                <div className={styles.showInfo}>
                  <span className={styles.ratingBadge}>
                    ⭐ {show.averageRating?.toFixed(1) || "N/A"}
                  </span>
                  <h4>{show.title}</h4>
                  <p className={styles.locationDesignation}>
                    📍 {show.locationDesignation || t("about.theatreNational")}
                  </p>
                  <button
                    className={styles.btnOutline}
                    onClick={() => navigate(`/show/${show.slug}`)}
                  >
                    {t("about.seeMore")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION DEVENIR PRODUCTEUR (Nouveau) */}
      <section className={styles.producerCta}>
        <div className={styles.producerContent}>
          <h2>{t("about.producerTitle")}</h2>
          <p>{t("about.producerDesc")}</p>
          <button
            className={styles.ctaGold}
            onClick={() => navigate("/register")}
          >
            {t("about.producerBtn")}
          </button>
        </div>
      </section>

      {/* SECTION AVIS CLIENTS */}
      <section className={styles.sectionLight}>
        <h2 className={styles.sectionTitleDark}>{t("about.sectionReviews")}</h2>
        <div className={styles.reviewGrid}>
          <div className={styles.reviewCard}>
            <img
              src="https://i.pravatar.cc/150?u=marc"
              alt="Avatar"
              className={styles.avatar}
            />
            <p>"{t("about.review1")}"</p>
            <div className={styles.stars}>★★★★★</div>
            <span className={styles.author}>- Marc D.</span>
          </div>
          <div className={styles.reviewCardWide}>
            <div className={styles.reviewImageAlt}></div>
            <div className={styles.reviewContent}>
              <p>"{t("about.review2")}"</p>
              <div className={styles.stars}>★★★★★</div>
              <span className={styles.author}>- Clara J.</span>
              <button className={styles.miniCta} onClick={() => navigate("/")}>
                {t("about.reserve")}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
