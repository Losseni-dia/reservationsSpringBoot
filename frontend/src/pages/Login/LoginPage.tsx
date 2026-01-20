import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../components/context/AuthContext'; // Ajuste le chemin selon ta structure
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title); // Nettoie l'état pour ne pas réafficher le message au refresh
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // On utilise la méthode login du contexte qui gère déjà le format URLSearchParams
      await login({ login: loginIdentifier, password });
      
      // Si le login réussit, on redirige
      navigate('/');
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      setError(err.message || "Identifiants incorrects ou serveur indisponible.");
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
        <p className={styles.logoSubtitle}>Le spectacle commence ici</p>
      </div>

      <div className={styles.loginCard}>
        <h2 className={styles.cardTitle}>Connexion</h2>
        
        {successMessage && (
          <div className="alert alert-success text-center" style={{ fontSize: '0.9rem', padding: '10px', marginBottom: '1.5rem' }}>
            {successMessage}
          </div>
        )}

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Identifiant / Email</label>
            <input
              type="text"
              value={loginIdentifier}
              onChange={(e) => setLoginIdentifier(e.target.value)}
              className={styles.input}
              placeholder="Votre login"
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          <div className={styles.forgotPasswordWrapper}>
            <Link to="/forgot-password" className={styles.forgotPasswordLink}>
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.submitButton} ${isLoading ? styles.buttonDisabled : ''}`}
          >
            {isLoading ? 'Connexion en cours...' : 'Se Connecter'}
          </button>
        </form>

        <p className={styles.footerText}>
          Pas encore de compte ?{' '}
          <Link to="/register" className={styles.signupLink}>
            S'inscrire
          </Link>
        </p>
      </div>

      <div className={styles.decorativeElement}></div>
    </div>
  );
};

export default LoginPage;