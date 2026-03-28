import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../components/context/AuthContext";
import { authApi } from "../../services/api";
import { UserProfileDto } from "../../types/models";
import styles from "./ProfilePage.module.css";

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, refreshProfile } = useAuth();
  const [formData, setFormData] = useState<Partial<UserProfileDto>>({
    firstname: "",
    lastname: "",
    email: "",
    langue: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });


  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        langue: user.langue || "fr",
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      await authApi.updateProfile(formData);
      await refreshProfile();
      setMessage({ type: "success", text: t("auth.profile.success") });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    }
  };

  if (!user)
    return (
      <div className="text-white text-center mt-5">{t("auth.loading")}</div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className="text-white mb-4">{t("auth.profile.title")}</h2>
        {message.text && (
          <div
            className={
              message.type === "success" ? styles.success : styles.error
            }
          >
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="row mb-3">
            <div className="col">
              <label className={styles.label}>{t("auth.firstname")}</label>
              <input
                className={styles.input}
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <label className={styles.label}>{t("auth.lastname")}</label>
              <input
                className={styles.input}
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className={styles.label}>{t("auth.email")}</label>
            <input
              className={styles.input}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
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

          {/* BOUTON ENREGISTRER : Placé tout en bas de la carte Profil */}
          <button type="submit" className={styles.btn}>
            {t("auth.profile.save")}
          </button>
        </form>
      </div>

    </div>
  );
};

export default ProfilePage;
