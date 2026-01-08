// Chemin : src/components/layout/Header.tsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.css';

const Header: React.FC = () => {
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
                </nav>

                <div className={styles.actions}>
                    {/* Recherche Simple avec SVG Blanc */}
                    <div className={styles.searchBox}>
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            fill="currentColor" 
                            className={styles.searchIcon} 
                            viewBox="0 0 16 16"
                        >
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                        <input 
                            type="text" 
                            className={styles.searchInput} 
                            placeholder="Rechercher..." 
                        />
                    </div>

                    <button className={styles.cartBtn}>
                        <span className={styles.cartIcon}>🛒</span>
                        <span className={styles.cartBadge}>0</span>
                    </button>
                    
                    <Link to="/login" className={styles.loginBtn}>Connexion</Link>
                </div>
            </div>
        </header>
    );
};

export default Header;