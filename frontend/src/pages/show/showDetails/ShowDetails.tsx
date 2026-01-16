import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showApi, IMAGE_STORAGE_BASE } from '../../../services/api';
import styles from './ShowDetails.module.css';
import Loader from '../../../components/ui/loader/Loader';

const ShowDetailPage: React.FC = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        showApi.getBySlug(slug)
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [slug]);

    // Loader.tsx ici
    if (loading) return <Loader />;

    if (error || !data) return <div className="text-white text-center mt-5">Oups ! {error}</div>;

    // Correction ici : data contient directement les champs selon votre ShowDTO
    const posterUrl = `${IMAGE_STORAGE_BASE}${data.posterUrl}`;

    return (
        <div className={styles.detailsContainer}>
            <div className={styles.heroSection} style={{ backgroundImage: `linear-gradient(to top, #141414, transparent), url(${posterUrl})` }}>
                <div className="container">
                    <h1 className={styles.title}>{data.title}</h1>
                    <p className={styles.locationTag}>📍 {data.locationDesignation || "Lieu non défini"}</p>
                </div>
            </div>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-lg-8">
                        <div className={styles.infoSection}>
                            <h3 className="text-white">À propos</h3>
                            <p className={styles.descriptionText}>{data.description}</p>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className={styles.bookingCard}>
                            <button className={styles.reserveBtn} disabled={!data.bookable}>
                                {data.bookable ? '🎟️ RÉSERVER' : 'COMPLET'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowDetailPage;