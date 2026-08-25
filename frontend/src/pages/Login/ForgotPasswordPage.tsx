import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authApi } from '../../services/api';
import styles from './LoginPage.module.css';

const ForgotPasswordPage: React.FC = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            await authApi.forgotPassword(email);
            setMessage({
                type: 'success',
                text: t('auth.forgotPassword.success')
            });
            setEmail(''); // Vider le champ
        } catch (err: any) {
            setMessage({
                type: 'error',
                text: err.message || t('auth.forgotPassword.errorGeneric')
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.logoSection}>
                <h1 className={styles.logoTitle}>
                    SMART<span className={styles.logoAccent}>BOOKING</span>
                </h1>
            </div>

            <div className={styles.loginCard}>
                <h2 className={styles.cardTitle}>{t('auth.forgotPassword.title')}</h2>
                <p style={{ color: '#aaa', textAlign: 'center', marginBottom: '20px', fontSize: '0.9rem' }}>
                    {t('auth.forgotPassword.description')}
                </p>

                {message && (
                    <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`} style={{ padding: '10px', marginBottom: '15px', borderRadius: '4px', fontSize: '0.9rem' }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>{t('auth.email')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            placeholder={t('auth.placeholderEmail')}
                            required
                        />
                    </div>

                    <button type="submit" disabled={isLoading} className={`${styles.submitButton} ${isLoading ? styles.buttonDisabled : ''}`}>
                        {isLoading ? t('auth.forgotPassword.submitLoading') : t('auth.forgotPassword.submit')}
                    </button>
                </form>

                <div className={styles.footerText} style={{ marginTop: '20px' }}>
                    <Link to="/login" className={styles.signupLink}>{t('auth.backToLogin')}</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;