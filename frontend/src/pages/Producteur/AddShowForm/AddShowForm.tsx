import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import styles from "./AddShowForm.module.css";

interface ShowDTO {
  id?: number;
  title: string;
  description: string;
  posterUrl?: string;
  bookable?: boolean;
}

interface Props {
  mode?: "add" | "edit";
  initialData?: ShowDTO | null;
  onSubmit: (data: ShowDTO) => void;
  isSubmitting: boolean;
}

const AddShowForm: React.FC<Props> = ({ mode = "add", initialData, onSubmit, isSubmitting }) => {
  const [show, setShow] = useState<ShowDTO>({ title: "", description: "", posterUrl: "", bookable: true });

  useEffect(() => {
    if (initialData) setShow(initialData);
  }, [initialData]);

  const handleChange = (field: keyof ShowDTO) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target instanceof HTMLInputElement && e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setShow((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form className={styles["add-show-form"]} onSubmit={(e) => { e.preventDefault(); onSubmit(show); }}>
      <div className={styles["form-group"]}>
        <label>Titre</label>
        <input type="text" value={show.title} onChange={handleChange("title")} required />
      </div>
      <div className={styles["form-group"]}>
        <label>Description</label>
        <textarea value={show.description} onChange={handleChange("description")} required />
      </div>
      <div className={styles["form-group"]}>
        <label>URL de l'image</label>
        <input type="text" value={show.posterUrl || ""} onChange={handleChange("posterUrl")} />
      </div>
      <button type="submit" className={styles["submit-btn"]} disabled={isSubmitting}>
        {isSubmitting ? "Traitement..." : mode === "edit" ? "Mettre à jour" : "Créer le spectacle"}
      </button>
    </form>
  );
};

export default AddShowForm;