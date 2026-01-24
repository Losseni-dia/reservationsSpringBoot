import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Show } from '../../types/models';
import { IMAGE_STORAGE_BASE } from '../../services/api';
import styles from './ShowCard.module.css';

interface ShowCardProps {
    show: Show;
}

const ShowCard: React.FC<ShowCardProps> = ({ show }) => {
    const navigate = useNavigate();

      const getImageUrl = (posterPath: string | null) => {
        // 1. Si pas d'image, placeholder
        if (!posterPath) {
            return 'https://placehold.co/400x600/1a1a1a/ffffff?text=Pas+d\'affiche';
        }

        // 2. Si c'est déjà une URL complète (ex: Firebase ou externe)
        if (posterPath.startsWith('http')) {
            return posterPath;
        }

        /**
         * 3. Logique de nettoyage :
         * Si posterPath = "/uploads/img.jpg" et IMAGE_STORAGE_BASE = ""
         * On veut éviter de rajouter un slash si le path commence déjà par un /
         */
        const cleanPath = posterPath.startsWith('/') ? posterPath : `/${posterPath}`;
        
        // On concatène. Si IMAGE_STORAGE_BASE est vide, ça donnera juste "/uploads/..."
        return `${IMAGE_STORAGE_BASE}${cleanPath}`;
    };

    return (
        <div className={styles.card} onClick={() => navigate(`/show/${show.slug}`)}>
            <div className={styles.posterContainer}>
                <img 
                    src={getImageUrl(show.posterUrl)} 
                    className={styles.poster} 
                    alt={show.title}
                />
            </div>
            <div className={styles.content}>
                <h5 className={styles.title}>{show.title}</h5>
                <p className={styles.location}>📍 {show.locationDesignation}</p>
                
                <div className={styles.buttonGroup}>
                    <Link 
                        to={`/show/${show.slug}`} 
                        className={styles.btnDetails}
                        onClick={(e) => e.stopPropagation()}
                    >
                        Détails
                    </Link>
                    <button 
                        className={styles.btnReserve} 
                        disabled={!show.bookable}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/show/${show.slug}`);
                        }}
                    >
                        {show.bookable ? 'Réserver' : 'Complet'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShowCard;