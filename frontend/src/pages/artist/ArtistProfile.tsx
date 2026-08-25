import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../components/context/AuthContext";
import { troupeApi } from "../../services/api";
import { Troupe } from "../../types/models";
import styles from "./ArtistProfile.module.css";

interface LanguageInfo {
  id: number;
  name: string;
  level: string;
}

interface TroupeInfo {
  id: number;
  name: string;
  logoUrl: string | null;
}

interface ArtistDetail {
  id: number;
  firstname: string;
  lastname: string;
  types: string[];
  languages?: LanguageInfo[];
  troupe?: TroupeInfo | null;
}

const ArtistProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();

  const [artist, setArtist] = useState<ArtistDetail | null>(null);
  const [availableLanguages, setAvailableLanguages] = useState<{ id: number; language: string }[]>([]);
  const [availableTroupes, setAvailableTroupes] = useState<Troupe[]>([]);

  // États formulaire langue
  const [selectedLangId, setSelectedLangId] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("COURANT");
  const [langMessage, setLangMessage] = useState("");

  // États formulaire troupe
  const [selectedTroupeId, setSelectedTroupeId] = useState<string>("");
  const [troupeMessage, setTroupeMessage] = useState("");
  const [troupeSubmitting, setTroupeSubmitting] = useState(false);

  const isComedien = artist?.types?.some((type) => type.toLowerCase() === "comédien");
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  const loadArtist = () => {
    fetch(`/api/artists/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setArtist(data);
        setSelectedTroupeId(data.troupe?.id?.toString() ?? "");
      })
      .catch((err) => console.error("Erreur artiste:", err));
  };

  useEffect(() => {
    loadArtist();

    fetch("/api/languages")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setAvailableLanguages(Array.isArray(data) ? data : []))
      .catch(() => setAvailableLanguages([]));

    troupeApi.getAll()
      .then(setAvailableTroupes)
      .catch(() => setAvailableTroupes([]));
  }, [id]);

  const handleAddLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLangId) return;

    const response = await fetch(`/api/artists/${id}/languages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ languageId: parseInt(selectedLangId), level: selectedLevel }),
    });

    if (response.ok) {
      setLangMessage(t("admin.artists.langSuccess") || "Langue ajoutée avec succès !");
      loadArtist();
    } else {
      setLangMessage(t("admin.artists.langError") || "Erreur lors de l'ajout.");
    }
  };

  const handleAssignTroupe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setTroupeSubmitting(true);
    setTroupeMessage("");
    try {
      const troupeId = selectedTroupeId ? parseInt(selectedTroupeId) : null;
      await troupeApi.assignArtist(parseInt(id), troupeId);
      setTroupeMessage("Troupe mise à jour avec succès !");
      loadArtist();
      setTimeout(() => setTroupeMessage(""), 4000);
    } catch {
      setTroupeMessage("Erreur lors de la mise à jour de la troupe.");
    } finally {
      setTroupeSubmitting(false);
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

        {/* SECTION TROUPE */}
        <section className={styles.languageSection}>
          <h3>🎪 Troupe</h3>

          {artist.troupe ? (
            <div className="d-flex align-items-center gap-3 mt-2">
              {artist.troupe.logoUrl && (
                <img
                  src={`/uploads/${artist.troupe.logoUrl}`}
                  alt={`Logo ${artist.troupe.name}`}
                  style={{ width: 50, height: 50, objectFit: "contain", borderRadius: 4 }}
                />
              )}
              <span className={styles.yellow} style={{ fontWeight: 600, fontSize: "1.05rem" }}>
                {artist.troupe.name}
              </span>
            </div>
          ) : (
            <p className={styles.noData}>Non affilié</p>
          )}

          {/* FORMULAIRE AFFILIATION — ADMIN UNIQUEMENT */}
          {isAdmin && (
            <div className={styles.adminFormBox}>
              <h4>Affecter à une troupe</h4>
              {troupeMessage && (
                <p className={troupeMessage.includes("succès") ? styles.alertSuccess : styles.alert}>
                  {troupeMessage}
                </p>
              )}
              <form onSubmit={handleAssignTroupe} className={styles.formRow}>
                <select
                  value={selectedTroupeId}
                  onChange={(e) => setSelectedTroupeId(e.target.value)}
                  className={styles.select}
                >
                  <option value="">— Non affilié —</option>
                  {availableTroupes.map((troupe) => (
                    <option key={troupe.id} value={troupe.id}>
                      {troupe.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className={styles.btnSubmit}
                  disabled={troupeSubmitting}
                >
                  {troupeSubmitting ? "..." : "Enregistrer"}
                </button>
              </form>
            </div>
          )}
        </section>

        {/* SECTION LANGUES — uniquement si comédien */}
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

            {isAdmin && (
              <div className={styles.adminFormBox}>
                <h4>Configurer les langues de l'artiste</h4>
                {langMessage && <p className={styles.alert}>{langMessage}</p>}
                <form onSubmit={handleAddLanguage} className={styles.formRow}>
                  <select
                    value={selectedLangId}
                    onChange={(e) => setSelectedLangId(e.target.value)}
                    className={styles.select}
                    required
                  >
                    <option value="">-- Choisir une langue --</option>
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
