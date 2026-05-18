import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../components/context/AuthContext";
import styles from "./ArtistProfile.module.css";

interface LanguageInfo {
  id: number;
  name: string;
  level: string;
}

interface ArtistDetail {
  id: number;
  firstname: string;
  lastname: string;
  types: string[];
  languages?: LanguageInfo[];
}

const ArtistProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { user } = useAuth(); // Récupération de l'utilisateur connecté et de son rôle

  const [artist, setArtist] = useState<ArtistDetail | null>(null);
  const [availableLanguages, setAvailableLanguages] = useState<
    { id: number; language: string }[]
  >([]);
  const [selectedLangId, setSelectedLangId] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("COURANT");
  const [message, setMessage] = useState("");

  const isComedien = artist?.types?.some(
    (type) => type.toLowerCase() === "comédien",
  );
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  useEffect(() => {
    // Charger les détails de l'artiste
    fetch(`/api/artists/${id}`)
      .then((res) => res.json())
      .then((data) => setArtist(data))
      .catch((err) => console.error("Erreur artiste:", err));

    // 🎯 Sécurisation du chargement des langues
    fetch("/api/languages")
      .then((res) => (res.ok ? res.json() : [])) // Si pas OK (ex: 404), on renvoie un tableau vide
      .then((data) => setAvailableLanguages(Array.isArray(data) ? data : []))
      .catch(() => setAvailableLanguages([])); // En cas de crash réseau, évite le crash de l'état
  }, [id]);
  const handleAddLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLangId) return;

    const response = await fetch(`/api/artists/${id}/languages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        languageId: parseInt(selectedLangId),
        level: selectedLevel,
      }),
    });

    if (response.ok) {
      setMessage(
        t("admin.artists.langSuccess") || "Langue ajoutée avec succès !",
      );
      // Recharger l'artiste pour actualiser la liste des langues
      fetch(`/api/artists/${id}`)
        .then((res) => res.json())
        .then((data) => setArtist(data));
    } else {
      setMessage(t("admin.artists.langError") || "Erreur lors de l'ajout.");
    }
  };

  if (!artist) return <div className={styles.container}>Chargement...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <header className={styles.header}>
          <h1>
            {artist.firstname}{" "}
            <span className={styles.yellow}>{artist.lastname}</span>
          </h1>
          <p className={styles.subtitle}>{artist.types?.join(", ")}</p>
        </header>

        {/* CONDITION SPECIALE : Uniquement si l'artiste est comédien */}
        {isComedien && (
          <section className={styles.languageSection}>
            <h3>🎭 Compétences Linguistiques (Comédien)</h3>
            <ul className={styles.langList}>
              {artist.languages?.map((lang, index) => (
                <li key={index} className={styles.langItem}>
                  <strong className={styles.yellow}>{lang.name}</strong> —{" "}
                  <span>{lang.level}</span>
                </li>
              ))}
              {!artist.languages?.length && (
                <p className={styles.noData}>Aucune langue enregistrée.</p>
              )}
            </ul>

            {/* FORMULAIRE SECURISE : Uniquement visible par l'ADMIN */}
            {isAdmin && (
              <div className={styles.adminFormBox}>
                <h4> Configurer les langues de l'artiste </h4>
                {message && <p className={styles.alert}>{message}</p>}
                <form onSubmit={handleAddLanguage} className={styles.formRow}>
                  <select
                    value={selectedLangId}
                    onChange={(e) => setSelectedLangId(e.target.value)}
                    className={styles.select}
                    required
                  >
                    <option value="">-- Choisir une langue --</option>

                    {/* 🎯 Sécurité anti-crash : on ne map que si c'est bien un tableau */}
                    {Array.isArray(availableLanguages) &&
                      availableLanguages.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.language}
                        </option>
                      ))}
                  </select>

                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className={styles.select}
                  >
                    <option value="MATERNELLE">Langue maternelle</option>
                    <option value="DEBUTANT">Débutant</option>
                    <option value="INTERMEDIAIRE">Intermédiaire</option>
                    <option value="COURANT">Courant</option>
                  </select>

                  <button type="submit" className={styles.btnSubmit}>
                    Ajouter
                  </button>
                </form>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default ArtistProfile;
