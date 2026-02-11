import React, { useEffect, useState } from 'react';
import { userApi } from '../../../services/api';
import { UserProfileDto } from '../../../types/models'; // Vérifie que ton DTO est bien ici
import Loader from '../../../components/ui/loader/Loader';
import styles from './AdminUsersPage.module.css';
import { deactivateUser, activateUser } from '../../../services/api';
const AdminUsersPage: React.FC = () => {
    const [users, setUsers] = useState<UserProfileDto[]>([]);
    const [loading, setLoading] = useState(true);

    const loadUsers = async () => {
        try {
            const data = await userApi.getAll();
            setUsers(data);
        } catch (err) {
            console.error("Erreur chargement users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`⚠️ ATTENTION : Supprimer définitivement l'utilisateur "${name}" ?`)) return;
        
        try {
            await userApi.delete(id);
            setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
        } catch (err) {
            alert("Erreur lors de la suppression. L'utilisateur a peut-être des données liées (réservations, etc.).");
        }
    };

    // Transforme "ROLE_ADMIN" en "admin" pour correspondre aux classes CSS
    const getRoleClass = (role: string) => {
        if (!role) return styles.member;
        const cleanRole = role.replace('ROLE_', '').toLowerCase();
        return styles[cleanRole] || styles.member;
    };

    if (loading) return <div className={styles.loaderContainer}><Loader /></div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Gestion des <span className={styles.yellow}>Utilisateurs</span></h1>
                <p>Interface d'administration • {users.length} comptes enregistrés</p>
            </header>

            <div className={styles.tableWrapper}>
                <table className={styles.userTable}>
                    <thead>
                        <tr>
                            <th>Identité</th>
                            <th>Identifiant</th>
                            <th>Email</th>
                            <th>Statut / Rôle</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td className={styles.userName}>
                                        {user.lastname?.toUpperCase()} {user.firstname}
                                    </td>
                                    <td>
                                        <code className={styles.loginTag}>{user.login}</code>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`${styles.roleBadge} ${getRoleClass(user.role)}`}>
                                            {user.role.replace('ROLE_', '')}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                                onClick={() => handleToggleStatus(user.id, user.isActive || false)}
                                                 className={user.isActive ? 'btn btn-warning' : 'btn btn-success'}
                                                            >
                                                     {user.isActive ? '🔴 Désactiver' : '✅ Activer'}
                                            </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className={styles.empty}>Aucun utilisateur trouvé.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsersPage;