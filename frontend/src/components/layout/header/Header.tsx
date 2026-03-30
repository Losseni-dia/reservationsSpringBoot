import React, { useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import LanguageSwitcher from '../../ui/languageSwitcher/LanguageSwitcher';
import styles from './Header.module.css';

const Header: React.FC = () => {
    const { t } = useTranslation();
    const { user, logout } = useAuth();
    const [isProducerOpen, setIsProducerOpen] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);

    const producerTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const adminTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleEnter = (setter: (v: boolean) => void, timer: React.MutableRefObject<any>) => {
        if (timer.current) clearTimeout(timer.current);
        setter(true);
    };

    const handleLeave = (setter: (v: boolean) => void, timer: React.MutableRefObject<any>) => {
        timer.current = setTimeout(() => setter(false), 300);
    };

    return (
        <header className={styles.header}>
            <div className="container d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                    <Link to="/" className={styles.logo}>SMART<span className={styles.yellow}>BOOKING</span></Link>
                </div>
                <nav className={styles.nav}>
                    <NavLink to="/" className={({isActive}) => isActive ? styles.activeLink : styles.link}>{t('layout.header.shows')}</NavLink>
                    <NavLink to="/about" className={({isActive}) => isActive ? styles.activeLink : styles.link}>
                        {t('layout.header.about')}
                    </NavLink>

                    {/* ESPACE PRODUCTEUR */}
                    {user && user.role === 'producer' && (
                        <div className={styles.dropdown} onMouseEnter={() => handleEnter(setIsProducerOpen, producerTimeout)} onMouseLeave={() => handleLeave(setIsProducerOpen, producerTimeout)}>
                                <button
                                type="button"
                                className={`${styles.dropdownBtn} ${styles.producerBtn}`}
                                aria-haspopup="menu"
                                aria-expanded={isProducerOpen}
                                onClick={() => setIsProducerOpen(v => !v)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') setIsProducerOpen(v => !v);
                                if (e.key === 'Escape') setIsProducerOpen(false); }}
                                >
                                {t('layout.header.producerSpace')} ▼
                                </button>
                                {isProducerOpen && (
                                <div className={styles.dropdownMenu}>
                                    <NavLink to="/producer/dashboard" className={styles.dropdownItem}>📊 {t('layout.header.dashboard')}</NavLink>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ESPACE ADMIN */}
                    {user && user.role === 'admin' && (
                        <div className={styles.dropdown} onMouseEnter={() => handleEnter(setIsAdminOpen, adminTimeout)} onMouseLeave={() => handleLeave(setIsAdminOpen, adminTimeout)}>
                            <button className={`${styles.dropdownBtn} ${styles.adminBtn}`}>{t('layout.header.administration')} ▼</button>
                            {isAdminOpen && (
                                <div className={styles.dropdownMenu}>
                                    <NavLink to="/admin" end className={styles.dropdownItem}>📊 {t('layout.header.dashboardGlobal')}</NavLink>
                                    <NavLink to="/admin/users" className={styles.dropdownItem}>👥 {t('layout.header.usersManagement')}</NavLink>
                                    <NavLink to="/admin/shows" className={styles.dropdownItem}>🎭 {t('layout.header.showsModeration')}</NavLink>
                                    <NavLink to="/admin/reviews" className={styles.dropdownItem}>⭐ {t('layout.header.reviewsModeration')}</NavLink>
                                    <NavLink to="/admin/locations" className={styles.dropdownItem}>📍 {t('layout.header.locationsManagement')}</NavLink>
                                </div>
                            )}
                        </div>
                    )}
                </nav>

                <div className={styles.actions}>
                    <LanguageSwitcher />
                    {user ? (
                <div className={styles.userActions}>
                        <Link to="/profile" className={styles.profileLink}>
                            {user.profilePictureUrl ? (
                                <img 
                                    src={user.profilePictureUrl} 
                                    alt="Profil" 
                                    className={styles.headerAvatar} 
                                />
                            ) : (
                                <span className={styles.defaultIcon}>👤</span>
                            )}
                            <span className={styles.firstNameText}>{user.firstname}</span>
                        </Link>
                        <button onClick={logout} className={styles.logoutBtn}>
                            {t('layout.header.logout')}
                        </button>
                    </div>
                )  : (
                        <div className={styles.authButtons}>
                            {/* DEVENIR PRODUCTEUR (Visiteur) */}
                            <Link to="/become-producer" className={styles.registerBtn}>{t('layout.header.becomeProducer')}</Link>
                            <Link to="/register" className={styles.registerBtn}>{t('layout.header.register')}</Link>
                            <Link to="/login" className={styles.loginBtn}>{t('layout.header.login')}</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
export default Header;