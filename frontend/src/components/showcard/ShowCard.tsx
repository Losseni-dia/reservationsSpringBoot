import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Show } from '../../types/models';
import { IMAGE_STORAGE_BASE } from '../../services/api';
import styles from './ShowCard.module.css';

interface ShowCardProps {
    show: Show;
}

const ShowCard: React.FC<ShowCardProps> = ({ show }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const getImageUrl = (posterPath: string | null) => {
        if (!posterPath) return `https://placehold.co/400x600/1a1a1a/ffffff?text=${encodeURIComponent(t('home.noPoster'))}`;
        if (posterPath.startsWith('http')) return posterPath;
        const cleanPath = posterPath.startsWith('/') ? posterPath : `/${posterPath}`;
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
                {/* BADGE DE NOTE SUR L'IMAGE (Style Netflix) */}
                {show.reviewCount !== undefined && show.reviewCount > 0 && (
                    <div className={styles.ratingBadge}>
                        <span className={styles.starIcon}>★</span>
                        {show.averageRating?.toFixed(1)}
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <h5 className={styles.title}>{show.title}</h5>
                <p className={styles.location}>📍 {show.locationDesignation}</p>
                
                {/* INFO DE NOMBRE D'AVIS */}
                <div className={styles.reviewSummary}>
                    {show.reviewCount && show.reviewCount > 0 ? (
                        <span className={styles.reviewCount}>
                            ({t('home.reviewsCount', { count: show.reviewCount })})
                        </span>
                    ) : (
                        <span className={styles.noReview}>{t('home.noReviews')}</span>
                    )}
                </div>

                <div className={styles.buttonGroup}>
                    <Link 
                        to={`/show/${show.slug}`} 
                        className={styles.btnDetails}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {t('home.details')}
                    </Link>
                    <button 
                        className={styles.btnReserve} 
                        disabled={!show.bookable}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/show/${show.slug}`);
                        }}
                    >
                        {show.bookable ? t('home.reserve') : t('home.full')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShowCard;