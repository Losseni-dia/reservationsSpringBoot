import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { showApi, reviewApi, IMAGE_STORAGE_BASE } from '../../../services/api';
import { useAuth } from '../../../components/context/AuthContext';
import { formatDate, formatDateTime, formatCurrency } from '../../../utils/format';
import Loader from '../../../components/ui/loader/Loader';
import { TranslatableText } from '../../../components/ui/translatableText/TranslatableText';
import { TranslatableComment } from '../../../components/ui/translatableComment/TranslatableComment';
import styles from './ShowDetails.module.css';

const ShowDetailPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
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
            .catch(() => {
                setError(t('show.errorLoad'));
                setLoading(false);
            });
    }, [slug, t]);

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
            setSubmitError(t('show.reviewErrorAlready'));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader />;
    if (error || !data) return <div className="text-white text-center mt-5">{error}</div>;

    const posterUrl = `${IMAGE_STORAGE_BASE}${data.posterUrl}`;
    const selectedRep = data.representations && data.representations[selectedRepIndex];

    const handleBookingRedirect = () => {
      // Redirige vers la route /reservation/le-slug-du-spectacle
      navigate(`/reservation/${slug}`);
    };

    return (
      <div className={styles.detailsContainer}>
        {/* HERO SECTION */}
        <div
          className={styles.heroSection}
          style={{
            backgroundImage: `linear-gradient(to top, #141414, transparent), url(${posterUrl})`,
          }}
        >
          <div className="container">
            <h1 className={styles.title}>{data.title}</h1>
            <p className={styles.locationTag}>
              📍 {data.locationDesignation || t('show.locationUndefined')}
            </p>
            {data.averageRating > 0 && (
              <div className={styles.ratingHero}>
                <span className={styles.starIcon}>★</span>
                <span className="fw-bold">{data.averageRating.toFixed(1)}</span>
                <span className="text-muted ms-2">
                  ({t('home.reviewsCount', { count: data.reviewCount })})
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="container mt-5">
          <div className="row">
            {/* COLONNE GAUCHE */}
            <div className="col-lg-8">
              <div className={styles.infoSection}>
                <h3>{t('show.about')}</h3>
                <TranslatableText
                  text={data.description || ''}
                  className={styles.descriptionText}
                  as="p"
                />
              </div>

              <div className={styles.editorialNote}>
                <h3>⭐ {t("show.editorialNoteTitle")}</h3>
                <p>
                  {t("show.editorialNoteText")}
                </p>
              </div>

              <div className={styles.infoSection}>
                <h3>{t('show.availableDates')}</h3>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  {data.representations?.map((rep: any, index: number) => (
                    <button
                      key={rep.id}
                      onClick={() => setSelectedRepIndex(index)}
                      className={`btn ${selectedRepIndex === index ? "btn-warning" : "btn-outline-light"}`}
                      style={
                        selectedRepIndex === index
                          ? { backgroundColor: "#f5c518", color: "#000" }
                          : {}
                      }
                    >
                      {formatDateTime(rep.when, i18n.language)}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.infoSection}>
                <h3>{t('show.artists')}</h3>
                <div className="mt-3">
                  {data.artists?.map((artist: any) => (
                    <div key={artist.id} className="text-light mb-2">
                      <span className="fw-bold">
                        {artist.firstname} {artist.lastname}
                      </span>
                      <small className={styles.artistType}>
                        ({artist.types.join(", ")})
                      </small>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-secondary my-5" />

              {/* SECTION AVIS */}
              <div className={styles.infoSection}>
                <h3 className="text-white mb-4">{t('show.reviews')}</h3>

                {/* FORMULAIRE D'AVIS */}
                <div className={styles.reviewFormContainer}>
                  {user ? (
                    <form
                      onSubmit={handleSubmitReview}
                      className={styles.reviewForm}
                    >
                      <h5 className="text-white mb-3">
                        {t('show.reviewPrompt')}
                      </h5>
                      <div className="mb-3">
                        <div className={styles.starPicker}>
                          {[1, 2, 3, 4, 5].map((num) => (
                            <span
                              key={num}
                              className={
                                num <= stars
                                  ? styles.starFull
                                  : styles.starEmpty
                              }
                              onClick={() => setStars(num)}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <textarea
                        className={styles.reviewTextarea}
                        placeholder={t('show.reviewPlaceholder')}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                      />
                      {submitError && (
                        <div className="text-danger mt-2 small">
                          {submitError}
                        </div>
                      )}
                      {submitSuccess && (
                        <div className="text-success mt-2 small">
                          ✓ {t('show.reviewSuccess')}
                        </div>
                      )}
                      <button
                        type="submit"
                        className={styles.submitReviewBtn}
                        disabled={submitting}
                      >
                        {submitting ? t('show.reviewSubmitting').toUpperCase() : t('show.reviewSubmit').toUpperCase()}
                      </button>
                    </form>
                  ) : (
                    <div className={styles.loginPrompt}>
                      {t('show.loginToReview')}
                    </div>
                  )}
                </div>

                {/* LISTE DES AVIS */}
                <div className="mt-5">
                  {data.reviews && data.reviews.length > 0 ? (
                    data.reviews.map((rev: any) => (
                      <div key={rev.id} className={styles.reviewCard}>
                        <div className="d-flex justify-content-between align-items-center">
                          <strong className="text-warning">
                            @{rev.authorLogin}
                          </strong>
                          <span className="text-muted small">
                            {formatDate(rev.createdAt, i18n.language)}
                          </span>
                        </div>
                        <div className={styles.starsDisplay}>
                          {"★".repeat(rev.stars)}
                          {"☆".repeat(5 - rev.stars)}
                        </div>
                        <p className={styles.reviewComment}>
                          "<TranslatableComment text={rev.comment} />"
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted italic">
                      {t('show.noReviewsYet')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* COLONNE DROITE (RÉSERVATION) */}
            <div className="col-lg-4">
              <div className={styles.bookingCard}>
                <h4 className="text-white mb-4 text-center">{t('show.booking')}</h4>
                {selectedRep ? (
                  <>
                    <p className="small text-muted mb-3">
                      {t('show.sessionDate')}{" "}
                      {formatDate(selectedRep.when, i18n.language)}
                    </p>
                    <div className="mb-4">
                      {selectedRep.prices?.map((p: any) => (
                        <div
                          key={p.id}
                          className={`${styles.priceItem} d-flex justify-content-between p-3 rounded`}
                        >
                          <span className="fw-bold">{p.type}</span>
                          <span className="text-warning">{formatCurrency(p.amount, i18n.language)}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      className={styles.reserveBtn}
                      disabled={!data.bookable}
                      onClick={handleBookingRedirect} // AJOUTE CET ÉVÉNEMENT ICI
                    >
                      {data.bookable ? `🎟️ ${t('show.reserve').toUpperCase()}` : t('show.full').toUpperCase()}
                    </button>
                  </>
                ) : (
                  <p className="text-center text-danger">
                    {t('show.noRepresentation')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default ShowDetailPage;