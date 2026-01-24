import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../services/api';
import styles from './LoginPage.module.css'; // On réutilise le style du login pour la cohérence

const ForgotPasswordPage: React.FC = () => {
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
                text: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.'
            });
            setEmail(''); // Vider le champ
        } catch (err: any) {
            setMessage({
                type: 'error',
                text: err.message || "Une erreur est survenue. Veuillez réessayer."
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
                <h2 className={styles.cardTitle}>Mot de passe oublié</h2>
                <p style={{ color: '#aaa', textAlign: 'center', marginBottom: '20px', fontSize: '0.9rem' }}>
                    Entrez votre adresse email pour recevoir un lien de réinitialisation.
                </p>

                {message && (
                    <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`} style={{ padding: '10px', marginBottom: '15px', borderRadius: '4px', fontSize: '0.9rem' }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            placeholder="exemple@email.com"
                            required
                        />
                    </div>

                    <button type="submit" disabled={isLoading} className={`${styles.submitButton} ${isLoading ? styles.buttonDisabled : ''}`}>
                        {isLoading ? 'Envoi...' : 'Envoyer le lien'}
                    </button>
                </form>

                <div className={styles.footerText} style={{ marginTop: '20px' }}>
                    <Link to="/login" className={styles.signupLink}>Retour à la connexion</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;