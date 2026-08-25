import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authApi } from '../../services/api';
import styles from './LoginPage.module.css';
import PasswordInput from "../../components/ui/passwordinput/PasswordInput";

const ResetPasswordPage: React.FC = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError(t('auth.resetPassword.tokenMissing'));
            return;
        }

        if (password !== confirmPassword) {
            setError(t('auth.resetPassword.errorPasswordMismatch'));
            return;
        }

        setIsLoading(true);

        try {
            await authApi.resetPassword(token, password);
            // Redirection vers le login avec un message de succès
            navigate('/login', { 
                state: { message: t('auth.resetPassword.success') } 
            });
        } catch (err: any) {
            try {
                // On lit le JSON
                const jsonError = JSON.parse(err.message);
                // On prend la clé "newPassword", sinon "message", sinon une erreur par défaut
                setError(jsonError.newPassword || jsonError.message || t('auth.resetPassword.errorExpired'));
            } catch {
                // Si ce n'est pas du JSON, on affiche le texte brut
                setError(err.message || t('auth.resetPassword.errorExpired'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.loginCard}>
                    <h2 className={styles.cardTitle} style={{color: '#ff4444'}}>{t('auth.resetPassword.invalidLinkTitle')}</h2>
                    <p style={{color: '#ccc', textAlign: 'center'}}>{t('auth.resetPassword.invalidLinkMessage')}</p>
                    <Link to="/login" className={styles.submitButton} style={{textAlign: 'center', textDecoration: 'none'}}>{t('auth.backToLogin')}</Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.logoSection}>
                <h1 className={styles.logoTitle}>SMART<span className={styles.logoAccent}>BOOKING</span></h1>
            </div>

            <div className={styles.loginCard}>
                <h2 className={styles.cardTitle}>{t('auth.resetPassword.title')}</h2>
                
                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>{t('auth.resetPassword.newPassword')}</label>
                        <PasswordInput
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            placeholder={t('auth.placeholderPassword')}
                            required
                        />
                        <small style={{ color: "#888", fontSize: "0.75rem", marginTop: "4px", display: "block" }}>
                            {t("auth.passwordRules")}
                        </small>
                    </div>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>{t('auth.confirm')}</label>
                        <PasswordInput
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={styles.input}
                            placeholder={t('auth.placeholderPassword')}
                            required
                        />
                    </div>

                    <button type="submit" disabled={isLoading} className={`${styles.submitButton} ${isLoading ? styles.buttonDisabled : ''}`}>
                        {isLoading ? t('auth.resetPassword.submitLoading') : t('auth.resetPassword.submit')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;