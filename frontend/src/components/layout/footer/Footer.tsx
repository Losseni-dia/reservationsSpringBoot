// Chemin : src/components/layout/Footer.tsx
import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
    const rssUrl = "http://localhost:8080/api/rss";
    return (
      <footer className={styles.footer}>
        <div className="container text-center">
          <div className={styles.socials}>
            <span>FB</span> <span>IG</span> <span>TW</span>
          </div>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()}{" "}
            <span className={styles.yellow}>SmartBooking</span>. All rights
            reserved.
          </p>
          <div className={styles.links}>
            <a href="#">Confidentialité</a>
            <a href="#">Conditions d'utilisation</a>

            // --- AJOUT DU LIEN RSS ---
            <a
              href={rssUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="S'abonner au flux RSS"
            >
              Flux RSS
            </a>
          </div>
        </div>
      </footer>
    );
};

export default Footer;