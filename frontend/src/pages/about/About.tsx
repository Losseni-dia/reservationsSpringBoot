import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./About.module.css";

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.overlay}>
          <h1 className={styles.title}>
            L’expérience <span>SmartBooking</span>
          </h1>
          <p className={styles.subtitle}>
            Là où la scène rencontre l’émotion. Vivez l'art, intensément.
          </p>
          <button className={styles.ctaPrimary} onClick={() => navigate("/")}>
            Découvrir nos spectacles
          </button>
        </div>
      </section>

      {/* NOS VALEURS */}
      <section className={styles.sectionDark}>
        <h2 className={styles.sectionTitle}>Nos Valeurs</h2>
        <div className={styles.cardGrid}>
          <div className={styles.valueCard}>
            <div className={styles.icon}>🎭</div>
            <h3>Passion Artistique</h3>
            <p>Une sélection pointue qui fait vibrer les publics.</p>
          </div>
          <div className={`${styles.valueCard} ${styles.activeCard}`}>
            <div className={styles.icon}>👥</div>
            <h3>Talents Émergents</h3>
            <p>Mettre en lumière les voix de demain.</p>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.icon}>🤝</div>
            <h3>Communauté</h3>
            <p>Partagez vos expériences avec d'autres passionnés.</p>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.icon}>🌍</div>
            <h3>Diversité</h3>
            <p>Toutes les formes d'art ont leur place ici.</p>
          </div>
        </div>
      </section>

      {/* AVIS SPECTATEURS */}
      <section className={styles.sectionLight}>
        <h2 className={styles.sectionTitleDark}>Ce que disent nos spectateurs</h2>
        <div className={styles.reviewGrid}>
          <div className={styles.reviewCard}>
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop" 
              alt="Marc D." 
              className={styles.avatar} 
            />
            <p>"Une plateforme fluide et inspirante pour mes sorties."</p>
            <div className={styles.stars}>★★★★★</div>
            <span className={styles.author}>- Marc D.</span>
          </div>
          
          <div className={styles.reviewCardWide}>
            <div className={styles.reviewImage}></div> {/* Image de fond via CSS */}
            <div className={styles.reviewContent}>
              <p>"J'ai découvert des pépites artistiques incroyables cette saison."</p>
              <div className={styles.stars}>★★★★★</div>
              <span className={styles.author}>- Clara J.</span>
              <button className={styles.miniCta}>Réserver</button>
            </div>
          </div>
        </div>
      </section>

      {/* NOS COUPS DE COEUR */}
      <section className={styles.sectionDark}>
        <h2 className={styles.sectionTitle}>Nos coups de cœur</h2>
        <div className={styles.showGrid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.showCard}>
              <div className={styles.showImagePlaceholder}></div>
              <div className={styles.showInfo}>
                <h4>Spectacle Événement {i}</h4>
                <p>Théâtre National - 20h00</p>
                <button className={styles.btnOutline}>Voir plus</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;