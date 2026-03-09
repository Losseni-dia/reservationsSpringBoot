import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authApi } from '../../../services/api';
import { UserRegistrationDto } from '../../../types/models';
// On réutilise le CSS de la page d'inscription pour avoir exactement le même design
import styles from '../../../pages/Register/RegisterPage.module.css';

const BecomeProducer: React.FC = () => {
    const { t, i18n } = useTranslation();
    
    // État du formulaire
    const [formData, setFormData] = useState<UserRegistrationDto & { role: string }>({
        login: '',
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
        langue: i18n.language || 'fr',
        role: 'Producteur' // Rôle forcé pour déclencher la validation admin
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation basique
        if (formData.password !== formData.confirmPassword) {
            setError(t('auth.register.errorPasswordMismatch'));
            return;
        }

        setLoading(true);

        try {
            // Envoi à l'API avec la langue courante
            const response = await authApi.register({
                ...formData,
                langue: i18n.language
            });

            if (response.ok) {
                // Succès : Le backend renvoie un message spécifique pour les producteurs
                setSuccess(true);
            } else {
                // Gestion des erreurs API (ex: Login déjà pris)
                const text = await response.text();
                let errorMessage = text;
                try {
                    const json = JSON.parse(text);
                    if (json.errors && Array.isArray(json.errors) && json.errors.length > 0) {
                        errorMessage = json.errors[0].defaultMessage;
                    } else if (json.message) {
                        errorMessage = json.message;
                    }
                } catch (e) {
                    // Si ce n'est pas du JSON, on garde le texte brut
                }
                setError(errorMessage || t('auth.register.errorGeneric'));
            }
        } catch (err: any) {
            console.error("Erreur d'inscription:", err);
            setError(t('auth.register.errorGeneric'));
        } finally {
            setLoading(false);
        }
    };

    // Affichage du message de succès
    if (success) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.logoSection}>
                    <h1 className={styles.logoTitle}>
                        SMART<span className={styles.logoAccent}>BOOKING</span>
                    </h1>
                </div>

                <div className={styles.registerCard}>
                    <h2 className={styles.cardTitle} style={{ color: '#f5c518' }}>Demande envoyée !</h2>
                    
                    <div style={{ textAlign: 'center', color: '#fff', marginBottom: '2rem' }}>
                        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                            Votre compte <strong style={{ color: '#f5c518' }}>Producteur</strong> a été créé avec succès.
                        </p>
                        <div style={{ 
                            backgroundColor: 'rgba(245, 197, 24, 0.1)', 
                            border: '1px solid #f5c518', 
                            color: '#f5c518', 
                            padding: '1rem', 
                            borderRadius: '6px',
                            fontSize: '0.95rem',
                            lineHeight: '1.5'
                        }}>
                            Il doit être validé par un administrateur avant de pouvoir vous connecter.
                            <br />
                            Vous recevrez un email dès que votre compte sera actif.
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Link to="/" className={styles.submitButton} style={{ textDecoration: 'none', textAlign: 'center', width: 'auto', padding: '12px 30px' }}>
                            Retour à l'accueil
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.logoSection}>
                <h1 className={styles.logoTitle}>
                    SMART<span className={styles.logoAccent}>BOOKING</span>
                </h1>
            </div>

            <div className={styles.registerCard}>
                <h2 className={styles.cardTitle}>Devenir Producteur</h2>
                <p style={{ textAlign: 'center', color: '#a0a0a0', marginBottom: '1.5rem', marginTop: '-1rem' }}>
                    Créez votre espace producteur pour publier vos spectacles.
                </p>
                
                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.row}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>{t('auth.firstname')}</label>
                            <input
                                name="firstname"
                                type="text"
                                value={formData.firstname}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder={t('auth.placeholderFirstname')}
                                required
                            />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>{t('auth.lastname')}</label>
                            <input
                                name="lastname"
                                type="text"
                                value={formData.lastname}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder={t('auth.placeholderLastname')}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>{t('auth.loginId')}</label>
                        <input
                            name="login"
                            type="text"
                            value={formData.login}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder={t('auth.placeholderChooseLogin')}
                            required
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>{t('auth.email')}</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder={t('auth.placeholderEmail')}
                            required
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>{t('auth.language')}</label>
                        <select
                            name="langue"
                            value={formData.langue}
                            onChange={handleChange}
                            className={styles.input}
                        >
                            <option value="fr">{t('auth.langFr')}</option>
                            <option value="en">{t('auth.langEn')}</option>
                            <option value="nl">{t('auth.langNl')}</option>
                        </select>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>{t('auth.password')}</label>
                            <input name="password" type="password" value={formData.password} onChange={handleChange} className={styles.input} placeholder={t('auth.placeholderPassword')} required />
                            <small style={{ color: '#888', fontSize: '0.75rem', marginTop: '4px' }}>
                                {t('auth.passwordRules')}
                            </small>
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>{t('auth.confirm')}</label>
                            <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className={styles.input} placeholder={t('auth.placeholderPassword')} required />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className={`${styles.submitButton} ${loading ? styles.buttonDisabled : ''}`}>
                        {loading ? t('auth.register.submitLoading') : "Envoyer ma demande"}
                    </button>
                </form>

                <p className={styles.footerText}>
                    {t('auth.register.hasAccount')}{' '}
                    <Link to="/login" className={styles.loginLink}>{t('auth.register.signIn')}</Link>
                </p>
            </div>
        </div>
    );
};

export default BecomeProducer;