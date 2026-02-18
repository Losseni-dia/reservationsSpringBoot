import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { reviewApi } from '../../../services/api';
import { Review } from '../../../types/models';
import Loader from '../../../components/ui/loader/Loader';
import { formatDate } from '../../../utils/format';
import styles from './AdminReviewPage.module.css';

const AdminReviewPage: React.FC = () => {
    const { t, i18n } = useTranslation();
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
        } catch (err) { alert(t("admin.reviews.errorValidate")); }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm(t("admin.reviews.confirmDelete"))) return;
        try {
            await reviewApi.delete(id);
            setPendingReviews(prev => prev.filter(r => r.id !== id));
        } catch (err) { alert(t("admin.reviews.errorDelete")); }
    };

    if (loading) return <Loader />;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>{t("admin.reviews.title")} <span className={styles.yellow}>{t("admin.reviews.titleHighlight")}</span></h1>
                <p>{t("admin.reviews.subtitle", { count: pendingReviews.length })}</p>
            </header>

            <div className={styles.list}>
                {pendingReviews.length > 0 ? (
                    pendingReviews.map(rev => (
                        <div key={rev.id} className={styles.reviewCard}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <strong className="text-warning">@{rev.authorLogin}</strong>
                                    <span className="text-muted ms-2">le {formatDate(rev.createdAt, i18n.language)}</span>
                                </div>
                                <div className={styles.stars}>{"★".repeat(rev.stars)}</div>
                            </div>
                            <p className={styles.comment}>"{rev.comment}"</p>
                            <div className={styles.actions}>
                                <button onClick={() => handleApprove(rev.id)} className={styles.approveBtn}>{t("admin.reviews.approve")}</button>
                                <button onClick={() => handleDelete(rev.id)} className={styles.rejectBtn}>{t("admin.reviews.delete")}</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.empty}>{t("admin.reviews.empty")}</div>
                )}
            </div>
        </div>
    );
};

export default AdminReviewPage;