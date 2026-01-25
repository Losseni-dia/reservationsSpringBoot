import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    
    // États séparés pour les deux menus déroulants
    const [isAffiliateOpen, setIsAffiliateOpen] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className="container d-flex justify-content-between align-items-center">
                <Link to="/" className={styles.logo}>
                    SMART<span className={styles.yellow}>BOOKING</span>
                </Link>
                
                <nav className={styles.nav}>
                    <NavLink to="/" className={({isActive}) => isActive ? styles.activeLink : styles.link}>
                        Spectacles
                    </NavLink>
                    <NavLink to="/locations" className={({isActive}) => isActive ? styles.activeLink : styles.link}>
                        Lieux
                    </NavLink>

                    {/* --- DROPDOWN ESPACE AFFILIÉS (Producteurs) --- */}
                    {user && (user.role === 'producer' || user.role === 'admin') && (
                        <div 
                            className={styles.dropdown}
                            onMouseEnter={() => setIsAffiliateOpen(true)}
                            onMouseLeave={() => setIsAffiliateOpen(false)}
                        >
                            <button className={styles.dropdownBtn}>
                                Espace Producteur <span className={styles.caret}>▼</span>
                            </button>

                            {isAffiliateOpen && (
                                <div className={styles.dropdownMenu}>
                                    <NavLink to="/producer/dashboard" className={styles.dropdownItem}>
                                        📊 Dashboard
                                    </NavLink>
                                    <NavLink to="/producer/shows/add" className={styles.dropdownItem}>
                                        ➕ Ajouter un spectacle
                                    </NavLink>
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- DROPDOWN ADMINISTRATION (Uniquement Admin) --- */}
                    {user && user.role === 'admin' && (
                        <div 
                            className={styles.dropdown}
                            onMouseEnter={() => setIsAdminOpen(true)}
                            onMouseLeave={() => setIsAdminOpen(false)}
                        >
                            <button className={`${styles.dropdownBtn} ${styles.adminBtn}`}>
                                Administration <span className={styles.caret}>▼</span>
                            </button>

                            {isAdminOpen && (
                                <div className={styles.dropdownMenu}>
                                    <NavLink to="/admin/users" className={styles.dropdownItem}>
                                        👥 Gestion Utilisateurs
                                    </NavLink>
                                    {/* Tu pourras ajouter "Gestion des Lieux" ou "Logs" ici plus tard */}
                                </div>
                            )}
                        </div>
                    )}
                </nav>

                <div className={styles.actions}>
                    {user ? (
                        <div className={styles.userActions}>
                            <Link to="/profile" className={styles.profileLink}>
                                👤 <span className="ms-1">{user.firstname}</span>
                            </Link>
                            <button onClick={logout} className={styles.logoutBtn}>Déconnexion</button>
                        </div>
                    ) : (
                        <div className={styles.authButtons}>
                            {/* BOUTON INSCRIPTION AJOUTÉ ICI */}
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