// Chemin : src/components/layout/Footer.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
    const { t } = useTranslation();

    return (
        <footer className={styles.footer}>
            <div className="container text-center">
                <div className={styles.socials}>
                    <span>FB</span> <span>IG</span> <span>TW</span>
                </div>
                <p className={styles.copyright}>
                    &copy; {new Date().getFullYear()} <span className={styles.yellow}>SmartBooking</span>. {t('layout.footer.allRightsReserved')}
                </p>
                <div className={styles.links}>
                    <a href="#">{t('layout.footer.privacy')}</a>
                    <a href="#">{t('layout.footer.terms')}</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;