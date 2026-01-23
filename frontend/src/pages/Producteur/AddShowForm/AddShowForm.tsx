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
    onSubmit: (formData: FormData) => void; // On change ShowDTO par FormData
    isSubmitting: boolean;
}

const AddShowForm: React.FC<Props> = ({ mode = "add", initialData, onSubmit, isSubmitting }) => {
    const [show, setShow] = useState<ShowDTO>({ title: "", description: "", bookable: true });
    
    // --- États pour l'image ---
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setShow(initialData);
            if (initialData.posterUrl) setPosterPreview(initialData.posterUrl);
        }
    }, [initialData]);

    const handleChange = (field: keyof ShowDTO) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target instanceof HTMLInputElement && e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setShow((prev) => ({ ...prev, [field]: value }));
    };

    // Gestion du fichier image
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPosterFile(file);
            setPosterPreview(URL.createObjectURL(file)); // Création de l'aperçu
        }
    };

    // Nettoyage de l'URL d'aperçu pour éviter les fuites mémoire
    useEffect(() => {
        return () => { if (posterPreview && posterPreview.startsWith('blob:')) URL.revokeObjectURL(posterPreview); };
    }, [posterPreview]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        // --- Création du FormData pour le Backend ---
        const formData = new FormData();
        
        // Partie JSON (correspond à @RequestPart("show") en Java)
        const showBlob = new Blob([JSON.stringify(show)], { type: 'application/json' });
        formData.append("show", showBlob);
        
        // Partie Fichier (correspond à @RequestPart("poster") en Java)
        if (posterFile) {
            formData.append("poster", posterFile);
        }

        onSubmit(formData);
    };

    return (
        <form className={styles["add-show-form"]} onSubmit={handleSubmit}>
            <div className={styles["form-group"]}>
                <label>Titre</label>
                <input type="text" value={show.title} onChange={handleChange("title")} required />
            </div>

            <div className={styles["form-group"]}>
                <label>Description</label>
                <textarea value={show.description} onChange={handleChange("description")} required />
            </div>

            <div className={styles["form-group"]}>
                <label>Affiche (Image)</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            {posterPreview && (
                <div className={styles["poster-preview"]}>
                    <img src={posterPreview} alt="Aperçu" />
                </div>
            )}

            <button type="submit" className={styles["submit-btn"]} disabled={isSubmitting}>
                {isSubmitting ? "Traitement..." : mode === "edit" ? "Mettre à jour" : "Créer le spectacle"}
            </button>
        </form>
    );
};

export default AddShowForm;