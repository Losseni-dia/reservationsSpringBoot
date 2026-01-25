import React, { useEffect, useState } from 'react';
import { userApi } from '../../../services/api';
import { UserProfileDto } from '../../../types/models';
import Loader from '../../../components/ui/loader/Loader';
import styles from './AdminUsersPage.module.css';

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

    useEffect(() => { loadUsers(); }, []);

    const handleDelete = async (id: number, name: string) => {
        // CORRECTIF 1 : Ajout des backticks pour la chaîne de caractères
        if (!window.confirm(`⚠️ ATTENTION : Supprimer définitivement l'utilisateur "${name}" ?`)) return;
        
        try {
            await userApi.delete(id);
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            alert("Erreur lors de la suppression. L'utilisateur a peut-être des réservations actives.");
        }
    };

    const getRoleClass = (role: string) => {
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
                                        {user.lastname.toUpperCase()} {user.firstname}
                                    </td>
                                    <td><code className={styles.loginTag}>{user.login}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {/* CORRECTIF 2 : Ajout des backticks pour l'interpolation des classes CSS */}
                                        <span className={`${styles.roleBadge} ${getRoleClass(user.role)}`}>
                                            {user.role.replace('ROLE_', '')}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            onClick={() => handleDelete(user.id, user.login)}
                                            className={styles.deleteBtn}
                                        >
                                            Supprimer
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