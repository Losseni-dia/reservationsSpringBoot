import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ShowDetails.module.css';

const ShowDetailPage: React.FC = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:8080/api/shows/details/${slug}`)
            .then(res => {
                if (!res.ok) throw new Error("Spectacle non trouvé");
                return res.json();
            })
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [slug]);

    if (loading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
            </div>
        );
    }

    if (error || !data || !data.show) {
        return (
            <div className={styles.detailsContainer} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="text-center">
                    <h2 className="text-white mb-4">Oups ! {error}</h2>
                    <button onClick={() => navigate('/')} className={styles.reserveBtn} style={{ width: 'auto', padding: '10px 30px' }}>
                        Retour au catalogue
                    </button>
                </div>
            </div>
        );
    }

    const posterUrl = `http://localhost:8080/uploads/${data.show.posterUrl}`;

    return (
        <div className={styles.detailsContainer}>
            <div 
                className={styles.heroSection} 
                style={{ backgroundImage: `linear-gradient(to top, #141414, transparent 90%), url(${posterUrl})` }}
            >
                <div className="container">
                    <h1 className={styles.title}>{data.show.title}</h1>
                    <p className={styles.locationTag}>📍 {data.show.locationDesignation}</p>
                </div>
            </div>

            <div className="container mt-5">
                <div className="row">
                    <div className="col-lg-8">
                        <div className={styles.infoSection}>
                            <h3 className="text-white mb-4">À propos</h3>
                            <p className={styles.descriptionText}>{data.show.description}</p>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className={styles.bookingCard}>
                            <h4 className="text-white mb-4">Réserver des places</h4>
                            
                            <div className={styles.priceList}>
                                {data.representations && data.representations.length > 0 ? (
                                    data.representations.map((rep: any) => (
                                        <div key={rep.id} className={styles.priceItem + " p-3 rounded mb-3"}>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <small className="d-block text-warning">
                                                        {new Date(rep.when).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                    </small>
                                                    <span className="text-white">{rep.locationName}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Affichage de tous les tarifs disponibles pour cette date */}
                                            <div className="mt-2 pt-2 border-top border-secondary">
                                                {rep.prices && rep.prices.map((p: any) => (
                                                    <div key={p.id} className="d-flex justify-content-between small text-light opacity-75">
                                                        <span>{p.type}</span>
                                                        <span>{p.amount} €</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted">Aucune date prévue.</p>
                                )}
                            </div>

                            <button 
                                className={styles.reserveBtn}
                                disabled={!data.show.bookable}
                                onClick={() => navigate(`/checkout/${data.show.slug}`)}
                            >
                                {data.show.bookable ? '🎟️ RÉSERVER MAINTENANT' : 'COMPLET'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowDetailPage;