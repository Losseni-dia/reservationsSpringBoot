import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../services/api';
import { useAuth } from '../../components/context/AuthContext';
import { UserRegistrationDto } from '../../types/models';
import styles from './RegisterPage.module.css';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserRegistrationDto>({
    login: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    langue: 'fr'
  });
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);

    try {
      // Le backend (UserRegistrationDto) a besoin de confirmPassword pour la validation
      // On envoie donc tout l'objet formData (qui contient confirmPassword et langue)
      await authApi.register(formData);
      
      // Connexion automatique et redirection vers l'accueil (géré par login)
      await login({
        login: formData.login,
        password: formData.password
      });
    } catch (err: any) {
      console.error("Erreur d'inscription:", err);
      
      let errorMessage = "Une erreur est survenue lors de l'inscription.";

      // Gestion spécifique de l'erreur 401 (UNAUTHORIZED) renvoyée par secureFetch
      if (err === "UNAUTHORIZED") {
        errorMessage = "Erreur 401 : L'inscription est bloquée par le serveur. Vérifiez la configuration Spring Security (permitAll).";
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && err.message) {
        errorMessage = err.message;
        try { 
          const json = JSON.parse(errorMessage); 
          // Gestion des erreurs de validation Spring Boot (ex: mot de passe faible)
          if (json.errors && Array.isArray(json.errors) && json.errors.length > 0) {
            errorMessage = json.errors[0].defaultMessage;
          } else if (json.message) {
            errorMessage = json.message; 
          }
        } catch(e) {}
      }

      setError(errorMessage);
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

      <div className={styles.registerCard}>
        <h2 className={styles.cardTitle}>Créer un compte</h2>
        
        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Prénom</label>
              <input
                name="firstname"
                type="text"
                value={formData.firstname}
                onChange={handleChange}
                className={styles.input}
                placeholder="Votre prénom"
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Nom</label>
              <input
                name="lastname"
                type="text"
                value={formData.lastname}
                onChange={handleChange}
                className={styles.input}
                placeholder="Votre nom"
                required
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Identifiant (Login)</label>
            <input
              name="login"
              type="text"
              value={formData.login}
              onChange={handleChange}
              className={styles.input}
              placeholder="Choisissez un identifiant"
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="exemple@email.com"
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Langue</label>
            <select
              name="langue"
              value={formData.langue}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="nl">Nederlands</option>
            </select>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Mot de passe</label>
              <input name="password" type="password" value={formData.password} onChange={handleChange} className={styles.input} placeholder="••••••••" required />
              <small style={{ color: '#888', fontSize: '0.75rem', marginTop: '4px' }}>
                8 car. min, 1 maj, 1 min, 1 chiffre, 1 spécial (@$!%*?&)
              </small>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Confirmer</label>
              <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className={styles.input} placeholder="••••••••" required />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className={`${styles.submitButton} ${isLoading ? styles.buttonDisabled : ''}`}>
            {isLoading ? 'Création...' : "S'inscrire"}
          </button>
        </form>

        <p className={styles.footerText}>
          Déjà un compte ?
          <Link to="/login" className={styles.loginLink}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;