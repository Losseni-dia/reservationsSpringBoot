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
        if (!posterPath) return 'https://placehold.co/400x400/1a1a1a/ffffff?text=Image+Manquante';
        return posterPath.startsWith('http') ? posterPath : `${IMAGE_STORAGE_BASE}${posterPath}`;
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