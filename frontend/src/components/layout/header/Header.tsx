import React, { useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LanguageSwitcher from '../../ui/languageSwitcher/LanguageSwitcher';
import styles from './Header.module.css';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const [isAffiliateOpen, setIsAffiliateOpen] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);

    const affiliateTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
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
                <Link to="/" className={styles.logo}>SMART<span className={styles.yellow}>BOOKING</span></Link>
                
                <nav className={styles.nav}>
                    <NavLink to="/" className={({isActive}) => isActive ? styles.activeLink : styles.link}>Spectacles</NavLink>
                    <NavLink to="/about" className={({isActive}) => isActive ? styles.activeLink : styles.link}>
                        À propos
                    </NavLink>

                    {/* ESPACE PRODUCTEUR */}
                    {user && (user.role === 'producer' || user.role === 'admin') && (
                        <div className={styles.dropdown} onMouseEnter={() => handleEnter(setIsAffiliateOpen, affiliateTimeout)} onMouseLeave={() => handleLeave(setIsAffiliateOpen, affiliateTimeout)}>
                                <button
                                type="button"
                                className={`${styles.dropdownBtn} ${styles.producerBtn}`}
                                aria-haspopup="menu"
                                aria-expanded={isAffiliateOpen}
                                onClick={() => setIsAffiliateOpen(v => !v)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') setIsAffiliateOpen(v => !v);
                                if (e.key === 'Escape') setIsAffiliateOpen(false); }}
                                >
                                Espace Producteur ▼
                                </button>
                                                            {isAffiliateOpen && (
                                <div className={styles.dropdownMenu}>
                                    <NavLink to="/producer/dashboard" className={styles.dropdownItem}>📊 Dashboard</NavLink>
                                   
                                </div>
                            )}
                        </div>
                    )}

                    {/* ESPACE ADMIN */}
                    {user && user.role === 'admin' && (
                        <div className={styles.dropdown} onMouseEnter={() => handleEnter(setIsAdminOpen, adminTimeout)} onMouseLeave={() => handleLeave(setIsAdminOpen, adminTimeout)}>
                            <button className={`${styles.dropdownBtn} ${styles.adminBtn}`}>Administration ▼</button>
                            {isAdminOpen && (
                                <div className={styles.dropdownMenu}>
                                    <NavLink to="/admin" end className={styles.dropdownItem}>📊 Dashboard Global</NavLink>
                                    <NavLink to="/admin/users" className={styles.dropdownItem}>👥 Gestion Utilisateurs</NavLink>
                                    <NavLink to="/admin/shows" className={styles.dropdownItem}>🎭 Modération Spectacles</NavLink>
                                    <NavLink to="/admin/reviews" className={styles.dropdownItem}>⭐ Modération Avis</NavLink>
                                    <NavLink to="/admin/locations" className={styles.dropdownItem}>📍 Gestion Lieux</NavLink>
                                </div>
                            )}
                        </div>
                    )}
                </nav>

                <div className={styles.actions}>
                    <LanguageSwitcher />
                    {user ? (
                        <div className={styles.userActions}>
                            <Link to="/profile" className={styles.profileLink}>👤 {user.firstname}</Link>
                            <button onClick={logout} className={styles.logoutBtn}>Déconnexion</button>
                        </div>
                    ) : (
                        <div className={styles.authButtons}>
                            <Link to="/register" className={styles.registerBtn}>Inscription</Link>
                            <Link to="/login" className={styles.loginBtn}>Connexion</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
export default Header;