import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { userApi } from '../../../services/api';
import { UserProfileDto } from '../../../types/models';
import Loader from '../../../components/ui/loader/Loader';
import styles from './AdminProducteurPage.module.css';
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
            setError("Impossible de charger les demandes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPendingUsers();
    }, []);

    const handleApprove = async (id: number) => {
        if (!window.confirm("Valider ce compte Producteur ?")) return;
        try {
            await userApi.approve(id);
            loadPendingUsers(); // Rafraîchir la liste
        } catch (e) {
            alert("Erreur lors de l'approbation");
        }
    };

    const handleReject = async (id: number) => {
        const userToReject = pendingUsers.find(u => u.id === id);
        const name = userToReject ? `${userToReject.firstname} ${userToReject.lastname}` : `ID ${id}`;
        if (!window.confirm(`Rejeter et supprimer définitivement la demande de "${name}" ?`)) return;
        try {
            await userApi.delete(id);
            loadPendingUsers(); // Rafraîchir la liste
        } catch (e) {
            alert(t('admin.users.errorDelete'));
        }
    };

    if (loading) return <Loader />;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Demandes <span style={{color: '#fff'}}>Producteurs</span></h1>
                    <p className={styles.subtitle}>{t('admin.users.subtitle', { count: pendingUsers.length })}</p>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>{t('admin.users.colIdentity')}</th>
                            <th>{t('admin.users.colEmail')}</th>
                            <th>{t('admin.users.colActions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingUsers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className={styles.emptyState}>Aucune demande de producteur en attente.</td>
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
                                    <td className={styles.actions}>
                                        <button onClick={() => handleApprove(user.id)} className={`${styles.btnAction} ${styles.btnApprove}`} title="Valider l'inscription">
                                            <HiCheckCircle /> Valider
                                        </button>
                                        <button onClick={() => handleReject(user.id)} className={`${styles.btnAction} ${styles.btnDelete}`} title="Rejeter et supprimer la demande">
                                            <HiTrash /> Rejeter
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