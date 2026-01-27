import React, { useEffect, useState } from 'react';
import { reviewApi } from '../../../services/api';
import { Review } from '../../../types/models';
import Loader from '../../../components/ui/loader/Loader';
import styles from './AdminReviewPage.module.css';

const AdminReviewPage: React.FC = () => {
    const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const loadPending = async () => {
        try {
            const data = await reviewApi.getPending();
            setPendingReviews(data);
        } catch (err) {
            console.error("Erreur chargement avis:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadPending(); }, []);

    const handleApprove = async (id: number) => {
        try {
            await reviewApi.validate(id);
            setPendingReviews(prev => prev.filter(r => r.id !== id));
        } catch (err) { alert("Erreur lors de la validation"); }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Supprimer définitivement cet avis ?")) return;
        try {
            await reviewApi.delete(id);
            setPendingReviews(prev => prev.filter(r => r.id !== id));
        } catch (err) { alert("Erreur lors de la suppression"); }
    };

    if (loading) return <Loader />;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Modération des <span className={styles.yellow}>Avis</span></h1>
                <p>{pendingReviews.length} avis en attente de relecture</p>
            </header>

            <div className={styles.list}>
                {pendingReviews.length > 0 ? (
                    pendingReviews.map(rev => (
                        <div key={rev.id} className={styles.reviewCard}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <strong className="text-warning">@{rev.authorLogin}</strong>
                                    <span className="text-muted ms-2">le {new Date(rev.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className={styles.stars}>{"★".repeat(rev.stars)}</div>
                            </div>
                            <p className={styles.comment}>"{rev.comment}"</p>
                            <div className={styles.actions}>
                                <button onClick={() => handleApprove(rev.id)} className={styles.approveBtn}>APPROUVER</button>
                                <button onClick={() => handleDelete(rev.id)} className={styles.rejectBtn}>SUPPRIMER</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.empty}>🎉 Tous les avis ont été modérés !</div>
                )}
            </div>
        </div>
    );
};

export default AdminReviewPage;