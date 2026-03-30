import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authApi } from '../../../services/api';
import { UserRegistrationDto } from '../../../types/models';
import styles from '../../../pages/Register/RegisterPage.module.css';
import PasswordInput from "../../../components/ui/passwordinput/PasswordInput";

const BecomeProducer: React.FC = () => {
    const { t, i18n } = useTranslation();
    
    const [formData, setFormData] = useState<UserRegistrationDto & { role: string }>({
        login: '',
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
        langue: i18n.language || 'fr',
        role: 'producer'
    });

    // --- ÉTATS POUR L'IMAGE ---
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // --- GESTION DU FICHIER ---
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

        setLoading(true);

        try {
            // --- CRÉATION DU FORMDATA ---
            const submitData = new FormData();
            submitData.append('login', formData.login);
            submitData.append('firstname', formData.firstname);
            submitData.append('lastname', formData.lastname);
            submitData.append('email', formData.email);
            submitData.append('password', formData.password);
            submitData.append('confirmPassword', formData.confirmPassword);
            submitData.append('langue', i18n.language);
            submitData.append('role', 'producer');

            if (selectedFile) {
                submitData.append('profilePictureFile', selectedFile);
            }

            // Envoi du FormData à l'API
            const response = await authApi.register(submitData as any);

            if (response.ok) {
                setSuccess(true);
            } else {
                const text = await response.text();
                let errorMessage = text;
                try {
                    const json = JSON.parse(text);
                    if (json.errors && Array.isArray(json.errors) && json.errors.length > 0) {
                        errorMessage = json.errors[0].defaultMessage;
                    } else if (json.message) {
                        errorMessage = json.message;
                    }
                } catch (e) {}
                setError(errorMessage || t('auth.register.errorGeneric'));
            }
        } catch (err: any) {
            console.error("Erreur d'inscription:", err);
            setError(t('auth.register.errorGeneric'));
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        // ... (Ton bloc de succès reste identique)
        return (
            <div className={styles.pageContainer}>
                <div className={styles.logoSection}>
                    <h1 className={styles.logoTitle}>SMART<span className={styles.logoAccent}>BOOKING</span></h1>
                </div>
                <div className={styles.registerCard}>
                    <h2 className={styles.cardTitle} style={{ color: '#f5c518' }}>Demande envoyée !</h2>
                    <div style={{ textAlign: 'center', color: '#fff', marginBottom: '2rem' }}>
                        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Votre compte <strong style={{ color: '#f5c518' }}>Producteur</strong> a été créé avec succès.</p>
                        <div style={{ backgroundColor: 'rgba(245, 197, 24, 0.1)', border: '1px solid #f5c518', color: '#f5c518', padding: '1rem', borderRadius: '6px' }}>
                            Il doit être validé par un administrateur avant de pouvoir vous connecter.
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Link to="/" className={styles.submitButton} style={{ textDecoration: 'none', textAlign: 'center', width: 'auto', padding: '12px 30px' }}>Retour à l'accueil</Link>
                    </div>
                </div>
            </div>
        );
    }

return (
        <div className={styles.pageContainer}>
            <div className={styles.logoSection}>
                <h1 className={styles.logoTitle}>SMART<span className={styles.logoAccent}>BOOKING</span></h1>
            </div>

            <div className={styles.registerCard}>
                <h2 className={styles.cardTitle}>Devenir Producteur</h2>
                <p style={{ textAlign: 'center', color: '#a0a0a0', marginBottom: '1.5rem', marginTop: '-1rem' }}>
                    Créez votre espace producteur pour publier vos spectacles.
                </p>
                
                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    
                    <div className={styles.photoUploadSection}>
                        <div className={styles.avatarPreview}>
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className={styles.previewImg} />
                            ) : (
                                <span className={styles.placeholderIcon}>👤</span>
                            )}
                        </div>
                        <label htmlFor="photo-upload" className={styles.uploadLabel}>
                            {t('auth.register.addPhoto')}
                        </label>
                        <input id="photo-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>{t('auth.firstname')}</label>
                            <input name="firstname" type="text" value={formData.firstname} onChange={handleChange} className={styles.input} required />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>{t('auth.lastname')}</label>
                            <input name="lastname" type="text" value={formData.lastname} onChange={handleChange} className={styles.input} required />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>{t('auth.loginId')}</label>
                        <input name="login" type="text" value={formData.login} onChange={handleChange} className={styles.input} required />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>{t('auth.email')}</label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} className={styles.input} required />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>{t('auth.language')}</label>
                        <select name="langue" value={formData.langue} onChange={handleChange} className={styles.input}>
                            <option value="fr">{t('auth.langFr')}</option>
                            <option value="en">{t('auth.langEn')}</option>
                            <option value="nl">{t('auth.langNl')}</option>
                        </select>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>{t('auth.password')}</label>
                            {/* 2. Utilisation du PasswordInput avec l'oeil */}
                            <PasswordInput 
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                className={styles.input} 
                                placeholder={t('auth.placeholderPassword')} 
                                required 
                            />
                            {/* 3. Ajout des conditions du mot de passe */}
                            <small style={{ color: '#888', fontSize: '0.75rem', marginTop: '4px' }}>
                                {t('auth.passwordRules')}
                            </small>
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>{t('auth.confirm')}</label>
                            {/* 4. Utilisation du PasswordInput pour la confirmation */}
                            <PasswordInput 
                                name="confirmPassword" 
                                value={formData.confirmPassword} 
                                onChange={handleChange} 
                                className={styles.input} 
                                placeholder={t('auth.placeholderPassword')} 
                                required 
                            />
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