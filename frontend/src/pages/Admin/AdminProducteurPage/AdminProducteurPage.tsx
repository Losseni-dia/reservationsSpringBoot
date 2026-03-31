import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { userApi } from '../../../services/api';
import { UserProfileDto } from '../../../types/models';
import Loader from '../../../components/ui/loader/Loader';
import styles from './AdminProducteurPage.module.css';
import AdminBackToDashboardButton from '../../../components/admin/AdminBackToDashboardButton';
import { HiCheckCircle, HiTrash } from 'react-icons/hi';

const AdminProducteurPage: React.FC = () => {
    const { t } = useTranslation();
    const [pendingUsers, setPendingUsers] = useState<UserProfileDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadPendingUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await userApi.getPending();
            setPendingUsers(data);
        } catch (err) {
            console.error("Erreur chargement des producteurs en attente:", err);
            setError(t("admin.pendingProducers.loadError"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPendingUsers();
    }, []);

    const handleApprove = async (id: number) => {
        if (!window.confirm(t("admin.pendingProducers.confirmApprove"))) return;
        try {
            await userApi.approve(id);
            loadPendingUsers(); // Rafraîchir la liste
        } catch (e: any) {
            alert(e.message || t("admin.pendingProducers.approveError"));
        }
    };

    const handleReject = async (id: number) => {
        const userToReject = pendingUsers.find(u => u.id === id);
        const name = userToReject
            ? `${userToReject.firstname} ${userToReject.lastname}`
            : t("admin.pendingProducers.rejectIdFallback", { id });
        if (!window.confirm(t("admin.pendingProducers.confirmReject", { name }))) return;
        try {
            await userApi.delete(id);
            loadPendingUsers(); // Rafraîchir la liste
        } catch (e: any) {
            alert(e.message || t('admin.users.errorDelete'));
        }
    };

    if (loading) return <Loader />;

    return (
        <div className={styles.container}>
            <AdminBackToDashboardButton />
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>
                        {t("admin.pendingProducers.pageTitle")}{" "}
                        <span style={{ color: "#fff" }}>
                            {t("admin.pendingProducers.pageTitleHighlight")}
                        </span>
                    </h1>
                    <p className={styles.subtitle}>
                        {t("admin.pendingProducers.subtitle", {
                            count: pendingUsers.length,
                        })}
                    </p>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>{t("admin.pendingProducers.colId")}</th>
                            <th>{t('admin.users.colIdentity')}</th>
                            <th>{t('admin.users.colEmail')}</th>
                            <th>{t('admin.pendingProducers.colDescription')}</th>
                            <th>{t('admin.users.colActions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className={styles.emptyState}>{t("admin.pendingProducers.empty")}</td>
                            </tr>
                        ) : (
                            pendingUsers.map(user => (
                                <tr key={user.id}>
                                    <td>#{user.id}</td>
                                    <td>
                                        <div style={{fontWeight: 'bold'}}>{user.firstname} {user.lastname}</div>
                                        <div style={{fontSize: '0.85em', color: '#888'}}>@{user.login}</div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td
                                        className={`${styles.descriptionCell} text-wrap text-break`}
                                    >
                                        {user.producerRequestDescription?.trim() ? (
                                            <span className={styles.descriptionText}>
                                                {user.producerRequestDescription}
                                            </span>
                                        ) : (
                                            <span className={styles.descriptionEmpty}>—</span>
                                        )}
                                    </td>
                                    <td className={styles.actions}>
                                        <button
                                            type="button"
                                            onClick={() => handleApprove(user.id)}
                                            className={`${styles.btnAction} ${styles.btnApprove}`}
                                            title={t("admin.pendingProducers.approveTitle")}
                                        >
                                            <HiCheckCircle />{" "}
                                            {t("admin.pendingProducers.approveButton")}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleReject(user.id)}
                                            className={`${styles.btnAction} ${styles.btnDelete}`}
                                            title={t("admin.pendingProducers.rejectTitle")}
                                        >
                                            <HiTrash />{" "}
                                            {t("admin.pendingProducers.rejectButton")}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProducteurPage;