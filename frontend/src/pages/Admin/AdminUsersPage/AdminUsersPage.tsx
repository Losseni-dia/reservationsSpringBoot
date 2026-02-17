import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { userApi } from '../../../services/api';
import { UserProfileDto } from '../../../types/models';
import Loader from '../../../components/ui/loader/Loader';
import styles from './AdminUsersPage.module.css';

const AdminUsersPage: React.FC = () => {
    const { t } = useTranslation();
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
        if (!window.confirm(t("admin.users.confirmDelete", { name }))) return;
        
        try {
            await userApi.delete(id);
            setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
        } catch (err) {
            alert(t("admin.users.errorDelete"));
        }
    };

    const handleToggleStatus = async (id: number, isActive: boolean) => {
        try {
            if (isActive) {
                await userApi.deactivate(id);
            } else {
                await userApi.activate(id);
            }
            await loadUsers();
        } catch (err) {
            alert(t("admin.users.errorDelete"));
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
                <h1>{t("admin.users.title")} <span className={styles.yellow}>{t("admin.users.titleHighlight")}</span></h1>
                <p>{t("admin.users.subtitle", { count: users.length })}</p>
            </header>

            <div className={styles.tableWrapper}>
                <table className={styles.userTable}>
                    <thead>
                        <tr>
                            <th>{t("admin.users.colIdentity")}</th>
                            <th>{t("admin.users.colLogin")}</th>
                            <th>{t("admin.users.colEmail")}</th>
                            <th>{t("admin.users.colStatus")}</th>
                            <th>{t("admin.users.colActions")}</th>
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
                                                     {user.isActive ? t("admin.users.deactivate") : t("admin.users.activate")}
                                            </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className={styles.empty}>{t("admin.users.empty")}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsersPage;