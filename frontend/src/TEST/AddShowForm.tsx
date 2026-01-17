import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { showApi } from "../services/api";
import styles from "./AddShowForm.module.css";

type ShowDTO = {
  title: string;
  description: string;
  date: string;
};

const AddShowForm: React.FC = () => {
  const [show, setShow] = useState<ShowDTO>({ title: "", description: "", date: "" });
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange =
    (field: keyof ShowDTO) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setShow((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!posterFile) {
      alert("Veuillez sélectionner une image");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("show", new Blob([JSON.stringify(show)], { type: "application/json" }));
    formData.append("poster", posterFile);

    try {
      await showApi.create(formData);
      alert("Spectacle ajouté avec succès !");
      setShow({ title: "", description: "", date: "" });
      setPosterFile(null);
      setPosterPreview(null);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout du spectacle.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (posterPreview) URL.revokeObjectURL(posterPreview);
    };
  }, [posterPreview]);

  return (
    <div className={styles.container}>
      <form className={styles["add-show-form"]} onSubmit={handleSubmit}>
        <h2>Ajouter un spectacle</h2>

        <div className={styles["form-group"]}>
          <label>Titre</label>
          <input 
            type="text" 
            value={show.title} 
            onChange={handleChange("title")} 
            required 
          />
        </div>

        <div className={styles["form-group"]}>
          <label>Description</label>
          <textarea 
            value={show.description} 
            onChange={handleChange("description")} 
            required 
          />
        </div>

        <div className={styles["form-group"]}>
          <label>Date</label>
          <input 
            type="date" 
            value={show.date} 
            onChange={handleChange("date")} 
            required 
          />
        </div>

        <div className={styles["form-group"]}>
          <label>Affiche (Poster)</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            required 
          />
        </div>

        {posterPreview && (
          <div className={styles["poster-preview"]}>
            <p>Prévisualisation :</p>
            <img src={posterPreview} alt="Aperçu affiche" />
          </div>
        )}

        <button 
          type="submit" 
          className={styles["submit-btn"]}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Ajout en cours..." : "Ajouter le spectacle"}
        </button>
      </form>
    </div>
  );
};

export default AddShowForm;
