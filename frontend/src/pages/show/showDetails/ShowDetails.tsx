import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { showApi, reviewApi, IMAGE_STORAGE_BASE } from '../../../services/api';
import { useAuth } from '../../../components/context/AuthContext';
import Loader from '../../../components/ui/loader/Loader';
import styles from './ShowDetails.module.css';

const ShowDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { user } = useAuth(); // Pour vérifier si l'utilisateur est connecté

    // --- ÉTATS DONNÉES ---
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRepIndex, setSelectedRepIndex] = useState(0);

    // --- ÉTATS FORMULAIRE AVIS ---
    const [comment, setComment] = useState("");
    const [stars, setStars] = useState(5);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Chargement des données
    const loadData = useCallback(() => {
        if (!slug) return;
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

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Soumission de l'avis
    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim() || !data) return;

        setSubmitting(true);
        setSubmitError(null);

        try {
            await reviewApi.create(data.id, comment, stars);
            setComment("");
            setStars(5);
            setSubmitSuccess(true);
            // On recharge les données pour mettre à jour la moyenne et la liste (si auto-validé)
            loadData();
            setTimeout(() => setSubmitSuccess(false), 5000);
        } catch (err: any) {
            setSubmitError("Erreur : Vous avez probablement déjà posté un avis sur ce spectacle.");
        } finally {
            setSubmitting(false);
        }
    };

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
                        <div className={styles.ratingHero}>
                            <span className={styles.starIcon}>★</span> 
                            <span className="fw-bold">{data.averageRating.toFixed(1)}</span>
                            <span className="text-muted ms-2">({data.reviewCount} avis)</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="container mt-5">
                <div className="row">
                    {/* COLONNE GAUCHE */}
                    <div className="col-lg-8">
                        <div className={styles.infoSection}>
                            <h3>À propos</h3>
                            <p className={styles.descriptionText}>{data.description}</p>
                        </div>

                        <div className={styles.infoSection}>
                            <h3>Dates disponibles</h3>
                            <div className="d-flex flex-wrap gap-2 mt-3">
                                {data.representations?.map((rep: any, index: number) => (
                                    <button 
                                        key={rep.id}
                                        onClick={() => setSelectedRepIndex(index)}
                                        className={`btn ${selectedRepIndex === index ? 'btn-warning' : 'btn-outline-light'}`}
                                        style={selectedRepIndex === index ? {backgroundColor: '#f5c518', color: '#000'} : {}}
                                    >
                                        {new Date(rep.when).toLocaleString('fr-FR', { 
                                            day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' 
                                        })}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.infoSection}>
                            <h3>Artistes</h3>
                            <div className="mt-3">
                                {data.artists?.map((artist: any) => (
                                    <div key={artist.id} className="text-light mb-2">
                                        <span className="fw-bold">{artist.firstname} {artist.lastname}</span>
                                        <small className={styles.artistType}>
                                            ({artist.types.join(', ')})
                                        </small>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <hr className="border-secondary my-5" />

                        {/* SECTION AVIS */}
                        <div className={styles.infoSection}>
                            <h3 className="text-white mb-4">Avis des spectateurs</h3>
                            
                            {/* FORMULAIRE D'AVIS */}
                            <div className={styles.reviewFormContainer}>
                                {user ? (
                                    <form onSubmit={handleSubmitReview} className={styles.reviewForm}>
                                        <h5 className="text-white mb-3">Votre avis nous intéresse</h5>
                                        <div className="mb-3">
                                            <div className={styles.starPicker}>
                                                {[1, 2, 3, 4, 5].map((num) => (
                                                    <span 
                                                        key={num} 
                                                        className={num <= stars ? styles.starFull : styles.starEmpty}
                                                        onClick={() => setStars(num)}
                                                    >★</span>
                                                ))}
                                            </div>
                                        </div>
                                        <textarea 
                                            className={styles.reviewTextarea}
                                            placeholder="Partagez votre expérience avec le public..."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            required
                                        />
                                        {submitError && <div className="text-danger mt-2 small">{submitError}</div>}
                                        {submitSuccess && <div className="text-success mt-2 small">✓ Merci ! Votre avis est enregistré.</div>}
                                        <button 
                                            type="submit" 
                                            className={styles.submitReviewBtn}
                                            disabled={submitting}
                                        >
                                            {submitting ? "ENVOI..." : "PUBLIER L'AVIS"}
                                        </button>
                                    </form>
                                ) : (
                                    <div className={styles.loginPrompt}>
                                        Connectez-vous pour laisser un avis sur ce spectacle.
                                    </div>
                                )}
                            </div>

                            {/* LISTE DES AVIS */}
                            <div className="mt-5">
                                {data.reviews && data.reviews.length > 0 ? (
                                    data.reviews.map((rev: any) => (
                                        <div key={rev.id} className={styles.reviewCard}>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <strong className="text-warning">@{rev.authorLogin}</strong>
                                                <span className="text-muted small">{new Date(rev.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className={styles.starsDisplay}>
                                                {"★".repeat(rev.stars)}{"☆".repeat(5 - rev.stars)}
                                            </div>
                                            <p className={styles.reviewComment}>"{rev.comment}"</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted italic">Aucun avis pour le moment. Soyez le premier à donner le vôtre !</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* COLONNE DROITE (RÉSERVATION) */}
                    <div className="col-lg-4">
                        <div className={styles.bookingCard}>
                            <h4 className="text-white mb-4 text-center">Réservation</h4>
                            {selectedRep ? (
                                <>
                                    <p className="small text-muted mb-3">Séance du {new Date(selectedRep.when).toLocaleDateString()}</p>
                                    <div className="mb-4">
                                        {selectedRep.prices?.map((p: any) => (
                                            <div key={p.id} className={`${styles.priceItem} d-flex justify-content-between p-3 rounded`}>
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