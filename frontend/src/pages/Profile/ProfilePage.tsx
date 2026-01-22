import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/context/AuthContext';
import { authApi } from '../../services/api';
import { UserProfileDto } from '../../types/models';
import styles from './ProfilePage.module.css';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState<Partial<UserProfileDto>>({
        firstname: '', lastname: '', email: '', langue: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                firstname: user.firstname || '',
                lastname: user.lastname || '',
                email: user.email || '',
                langue: user.langue || 'fr'
            }));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            await authApi.updateProfile(formData);
            setMessage({ type: 'success', text: 'Profil mis à jour !' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    if (!user) return <div className="text-white text-center mt-5">Chargement...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className="text-white mb-4">Mon Profil</h2>
                {message.text && <div className={message.type === 'success' ? styles.success : styles.error}>{message.text}</div>}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className="row mb-3">
                        <div className="col"><label className={styles.label}>Prénom</label>
                        <input className={styles.input} type="text" name="firstname" value={formData.firstname} onChange={handleChange}/></div>
                        <div className="col"><label className={styles.label}>Nom</label>
                        <input className={styles.input} type="text" name="lastname" value={formData.lastname} onChange={handleChange}/></div>
                    </div>
                    <div className="mb-3"><label className={styles.label}>Email</label>
                    <input className={styles.input} type="email" name="email" value={formData.email} onChange={handleChange}/></div>

                    <div className="mb-3">
                        <label className={styles.label}>Langue</label>
                        <select className={styles.input} name="langue" value={formData.langue} onChange={handleChange}>
                            <option value="fr">Français</option>
                            <option value="en">English</option>
                            <option value="nl">Nederlands</option>
                        </select>
                    </div>

                    <button type="submit" className={styles.btn}>Enregistrer</button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;