import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { showApi, IMAGE_STORAGE_BASE } from '../../../services/api';
import Loader from '../../../components/ui/loader/Loader';
import styles from './ShowDetails.module.css';

const ShowDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // État pour gérer la représentation (date) sélectionnée
    const [selectedRepIndex, setSelectedRepIndex] = useState(0);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        showApi.getBySlug(slug)
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                setError("Impossible de charger les détails du spectacle.");
                setLoading(false);
            });
    }, [slug]);

    if (loading) return <Loader />;
    if (error || !data) return <div className="text-white text-center mt-5">{error}</div>;

    const posterUrl = `${IMAGE_STORAGE_BASE}${data.posterUrl}`;
    const selectedRep = data.representations && data.representations[selectedRepIndex];

    return (
        <div className={styles.detailsContainer}>
            {/* HERO SECTION */}
            <div 
                className={styles.heroSection} 
                style={{ backgroundImage: `linear-gradient(to top, #141414, transparent), url(${posterUrl})` }}
            >
                <div className="container">
                    <h1 className={styles.title}>{data.title}</h1>
                    <p className={styles.locationTag}>📍 {data.locationDesignation || "Lieu non défini"}</p>
                    {data.averageRating > 0 && (
                        <p className="text-warning fw-bold">⭐ {data.averageRating.toFixed(1)} / 5 ({data.reviewCount} avis)</p>
                    )}
                </div>
            </div>

            <div className="container mt-5">
                <div className="row">
                    {/* COLONNE GAUCHE */}
                    <div className="col-lg-8">
                        {/* Description */}
                        <div className={styles.infoSection}>
                            <h3 className="text-white">À propos</h3>
                            <p className={styles.descriptionText}>{data.description}</p>
                        </div>

                        {/* Choix de la date (Représentations) */}
                        <div className={styles.infoSection}>
                            <h3 className="text-white">Dates disponibles</h3>
                            <div className="d-flex flex-wrap gap-2 mt-3">
                                {data.representations?.map((rep: any, index: number) => (
                                    <button 
                                        key={rep.id}
                                        onClick={() => setSelectedRepIndex(index)}
                                        className={`btn ${selectedRepIndex === index ? 'btn-warning' : 'btn-outline-light'}`}
                                        style={selectedRepIndex === index ? {backgroundColor: '#f5c518', color: '#000'} : {}}
                                    >
                                        {new Date(rep.when).toLocaleDateString('fr-FR', { 
                                            day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' 
                                        })}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.infoSection}>
                            <h3 className="text-white">Artistes</h3>
                            <div className="mt-3">
                                {data.artists?.map((artist: any) => (
                                    <div key={artist.id} className="text-light mb-2">
                                        <span className="fw-bold">{artist.firstname} {artist.lastname}</span>
                                      
                                        <small className="text-warning">
                                            {/* Types sera maintenant ["Acteur", "Scénographe"] */}
                                            ({artist.types.join(', ')})
                                        </small>
                                          <br />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Avis des utilisateurs */}
                        <div className={styles.infoSection}>
                            <h3 className="text-white">Avis des spectateurs</h3>
                            {data.reviews && data.reviews.length > 0 ? (
                                data.reviews.map((rev: any) => (
                                    <div key={rev.id} className="mb-4 p-3 border-bottom border-secondary">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <strong className="text-warning">{rev.userFirstname}</strong>
                                            <span className="text-muted small">{new Date(rev.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-warning mb-2">{"★".repeat(rev.stars)}{"☆".repeat(5 - rev.stars)}</div>
                                        <p className="text-light italic">"{rev.comment}"</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">Aucun avis pour le moment.</p>
                            )}
                        </div>
                    </div>

                    {/* COLONNE DROITE (BOOKING CARD) */}
                    <div className="col-lg-4">
                        <div className={styles.bookingCard}>
                            <h4 className="text-white mb-4 text-center">Réservation</h4>
                            
                            {selectedRep ? (
                                <>
                                    <p className="small text-muted mb-3">Tarifs pour la séance du {new Date(selectedRep.when).toLocaleDateString()}</p>
                                    <div className="mb-4">
                                        {selectedRep.prices?.map((p: any) => (
                                            <div key={p.id} className={`${styles.priceItem} d-flex justify-content-between p-3 rounded mb-2`}>
                                                <span className="fw-bold">{p.type}</span>
                                                <span className="text-warning">{p.amount} €</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button 
                                        className={styles.reserveBtn} 
                                        disabled={!data.bookable}
                                    >
                                        {data.bookable ? '🎟️ RÉSERVER' : 'COMPLET'}
                                    </button>
                                </>
                            ) : (
                                <p className="text-center text-danger">Aucune représentation disponible.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowDetailPage;