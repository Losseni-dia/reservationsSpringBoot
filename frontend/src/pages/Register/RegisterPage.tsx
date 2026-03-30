import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authApi } from '../../services/api';
import { useAuth } from '../../components/context/AuthContext';
import { UserRegistrationDto } from '../../types/models';
import styles from './RegisterPage.module.css';
import PasswordInput from "../../components/ui/passwordinput/PasswordInput";

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.register.errorPasswordMismatch'));
      return;
    }

    setIsLoading(true);

    try {
      // Le backend (UserRegistrationDto) a besoin de confirmPassword pour la validation
      // On envoie donc tout l'objet formData (qui contient confirmPassword et langue)
      await authApi.register(formData as any);
      const submitData = new FormData();
      submitData.append('login', formData.login);
      submitData.append('firstname', formData.firstname);
      submitData.append('lastname', formData.lastname);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('confirmPassword', formData.confirmPassword);
      submitData.append('langue', formData.langue);
      if (selectedFile) {
        submitData.append('profilePictureFile', selectedFile);
      }
      await authApi.register(submitData as any);

      // Connexion automatique et redirection vers l'accueil (géré par login)
      await login({
        login: formData.login,
        password: formData.password
      });
    } catch (err: any) {
      console.error("Erreur d'inscription:", err);
      
      let errorMessage = t('auth.register.errorGeneric');

      if (err === "UNAUTHORIZED") {
        errorMessage = t('auth.register.errorGeneric');
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
        <h2 className={styles.cardTitle}>{t("auth.register.title")}</h2>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.photoUploadSection}>
            <div className={styles.avatarPreview}>
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className={styles.previewImg} />
              ) : (
                <div className={styles.placeholderIcon}>👤</div>
              )}
            </div>
            <label htmlFor="photo-upload" className={styles.uploadLabel}>
              {t("auth.register.addPhoto") || "Ajouter une photo"}
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.fileInput}
              style={{ display: 'none' }}
            />
          </div>
          
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>{t("auth.firstname")}</label>
              <input
                name="firstname"
                type="text"
                value={formData.firstname}
                onChange={handleChange}
                className={styles.input}
                placeholder={t("auth.placeholderFirstname")}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>{t("auth.lastname")}</label>
              <input
                name="lastname"
                type="text"
                value={formData.lastname}
                onChange={handleChange}
                className={styles.input}
                placeholder={t("auth.placeholderLastname")}
                required
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>{t("auth.loginId")}</label>
            <input
              name="login"
              type="text"
              value={formData.login}
              onChange={handleChange}
              className={styles.input}
              placeholder={t("auth.placeholderChooseLogin")}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>{t("auth.email")}</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder={t("auth.placeholderEmail")}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>{t("auth.language")}</label>
            <select
              name="langue"
              value={formData.langue}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="fr">{t("auth.langFr")}</option>
              <option value="en">{t("auth.langEn")}</option>
              <option value="nl">{t("auth.langNl")}</option>
            </select>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>{t("auth.password")}</label>
              <PasswordInput
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                placeholder={t("auth.placeholderPassword")}
                required
              />
              <small
                style={{ color: "#888", fontSize: "0.75rem", marginTop: "4px" }}
              >
                {t("auth.passwordRules")}
              </small>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>{t("auth.confirm")}</label>
              <PasswordInput
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.input}
                placeholder={t("auth.placeholderPassword")}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.submitButton} ${isLoading ? styles.buttonDisabled : ""}`}
          >
            {isLoading
              ? t("auth.register.submitLoading")
              : t("auth.register.submit")}
          </button>
        </form>

        <p className={styles.footerText}>
          {t("auth.register.hasAccount")}{" "}
          <Link to="/login" className={styles.loginLink}>
            {t("auth.register.signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;