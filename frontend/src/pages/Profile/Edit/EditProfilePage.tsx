import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../components/context/AuthContext";
import { authApi } from "../../../services/api";
import { UserProfileDto } from "../../../types/models";
import styles from "./EditProfilePage.module.css"; 

const EditProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // Nouveaux états pour gérer l'image
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<UserProfileDto>>({
    firstname: "",
    lastname: "",
    email: "",
    langue: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        langue: user.langue || "fr",
      });
      // Si l'utilisateur a déjà une photo, on l'affiche
      if (user && user.profilePictureUrl) {
    console.log("URL de l'image reçue :", user.profilePictureUrl); // Pour vérifier dans la console F12
    setPreviewUrl(user.profilePictureUrl);
  }
    }
  }, [user]);

  // Gestion du changement de texte classique
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Nouvelle fonction : Gère le moment où l'utilisateur choisit une photo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Crée une URL locale temporaire pour afficher l'image choisie
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setIsLoading(true);

    try {
      // ⚠️ Changement important : On utilise FormData pour envoyer du texte ET un fichier
      const submitData = new FormData();
      if (user && user.id) {
        submitData.append("id", user.id.toString());
        }
      submitData.append("firstname", formData.firstname || "");
      submitData.append("lastname", formData.lastname || "");
      submitData.append("email", formData.email || "");
      submitData.append("langue", formData.langue || "fr");
      
      // Si une nouvelle image a été sélectionnée, on l'ajoute !
      if (selectedFile) {
        submitData.append("profilePictureFile", selectedFile); 
      }

      // Attention : ton authApi.updateProfile doit être configuré pour accepter ce FormData
      await authApi.updateProfile(submitData as any); 
      await refreshProfile(); // Met à jour le contexte global
      
      // Redirige vers la page profil en lecture seule avec un message de succès
      navigate("/profile", { state: { message: t("auth.profile.success") } });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Une erreur est survenue" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <div className="text-white text-center mt-5">{t("auth.loading")}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Lien de retour */}
        <div className={styles.backLinkContainer}>
            <Link to="/profile" className={styles.backLink}>
              ← Retour au profil
            </Link>
        </div>

        <h2 className={styles.title}>Modifier mon profil</h2>
        
        {message.text && (
          <div className={message.type === "success" ? styles.success : styles.error}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          
          {/* --- SECTION AVATAR --- */}
          <div className={styles.avatarSection}>
            <div 
              className={styles.avatarWrapper} 
              onClick={() => fileInputRef.current?.click()}
            >
            <img 
                src={previewUrl || `https://ui-avatars.com/api/?name=${formData.firstname}+${formData.lastname}&background=random`} 
                alt="Profil" 
                className={styles.avatarImage} 
            />
              <div className={styles.avatarOverlay}>
                <span>📷 Modifier</span>
              </div>
            </div>
            
            {/* Input fichier caché, déclenché par le clic sur l'image */}
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: "none" }} 
            />
          </div>
          {/* ---------------------- */}

          <div className={styles.row}>
            <div className={styles.col}>
              <label className={styles.label}>{t("auth.firstname")}</label>
              <input 
                className={styles.input} 
                type="text" 
                name="firstname" 
                value={formData.firstname} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className={styles.col}>
              <label className={styles.label}>{t("auth.lastname")}</label>
              <input 
                className={styles.input} 
                type="text" 
                name="lastname" 
                value={formData.lastname} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>{t("auth.email")}</label>
            <input 
              className={styles.input} 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>{t("auth.language")}</label>
            <select 
              className={styles.input} 
              name="langue" 
              value={formData.langue} 
              onChange={handleChange}
            >
              <option value="fr">{t("auth.langFr")}</option>
              <option value="en">{t("auth.langEn")}</option>
              <option value="nl">{t("auth.langNl")}</option>
            </select>
          </div>

          <button type="submit" className={styles.btn} disabled={isLoading}>
            {isLoading ? "Chargement..." : t("auth.profile.save")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;