import React, { useState } from 'react'; // Ajout de useState
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

                    {/* --- DROPDOWN ESPACE AFFILIÉS --- */}
                    {user && (user.role === 'affiliate' || user.role === 'admin') && (
                        <div 
                            className={styles.dropdown}
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            <button className={styles.dropdownBtn}>
                                Espace Affiliés <span className={styles.caret}>▼</span>
                            </button>

                            {isDropdownOpen && (
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
                </nav>

                {/* ... Reste du code (actions, searchBox, user) ... */}
                <div className={styles.actions}>
                     {/* Ton code existant pour le panier et l'utilisateur */}
                     {user ? (
                        <div className={styles.userActions}>
                            <Link to="/profile" className={styles.profileLink}>
                                👤 <span className="ms-1">{user.firstname}</span>
                            </Link>
                            <button onClick={logout} className={styles.logoutBtn}>Déconnexion</button>
                        </div>
                    ) : (
                        <Link to="/login" className={styles.loginBtn}>Connexion</Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;