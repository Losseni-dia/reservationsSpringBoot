import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../../services/api';
import styles from './LoginPage.module.css';

const ResetPasswordPage: React.FC = () => {
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
            setError("Token manquant ou invalide.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        setIsLoading(true);

        try {
            await authApi.resetPassword(token, password);
            // Redirection vers le login avec un message de succès
            navigate('/login', { 
                state: { message: "Mot de passe réinitialisé avec succès. Vous pouvez vous connecter." } 
            });
        } catch (err: any) {
            setError(err.message || "Le lien a expiré ou est invalide.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.loginCard}>
                    <h2 className={styles.cardTitle} style={{color: '#ff4444'}}>Lien invalide</h2>
                    <p style={{color: '#ccc', textAlign: 'center'}}>Le lien de réinitialisation est manquant.</p>
                    <Link to="/login" className={styles.submitButton} style={{textAlign: 'center', textDecoration: 'none'}}>Retour au login</Link>
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
                <h2 className={styles.cardTitle}>Nouveau mot de passe</h2>
                
                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Nouveau mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Confirmer</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={styles.input}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" disabled={isLoading} className={`${styles.submitButton} ${isLoading ? styles.buttonDisabled : ''}`}>
                        {isLoading ? 'Réinitialiser...' : 'Valider'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;