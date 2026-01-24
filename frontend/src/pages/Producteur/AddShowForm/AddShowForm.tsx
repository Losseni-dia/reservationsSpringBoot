import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { showApi, locationApi, artistTypeApi } from "../../../services/api";
import styles from "./AddShowForm.module.css";

interface ShowCreateRequest {
    id?: number;
    title: string;
    description: string;
    locationId: number | "";
    artistTypeIds: number[];
    bookable: boolean;
    posterUrl?: string; // Correctif pour l'erreur TS(2339)
}

interface Props {
    mode?: "add" | "edit";
    initialData?: any; 
    onSubmit: (formData: FormData) => void;
    isSubmitting: boolean;
}

const AddShowForm: React.FC<Props> = ({ mode = "add", initialData, onSubmit, isSubmitting }) => {
    // 1. État du formulaire
    const [show, setShow] = useState<ShowCreateRequest>({
        title: "",
        description: "",
        locationId: "",
        artistTypeIds: [],
        bookable: true
    });

    // 2. États pour les options (Chargés depuis la DB)
    const [locations, setLocations] = useState<any[]>([]);
    const [availableArtists, setAvailableArtists] = useState<any[]>([]);

    // 3. États pour l'image
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);

    // Chargement des données initiales (Lieux et Artistes)
    // 1. Premier useEffect : Charger les listes de la base de données (Lieux & Artistes)
    useEffect(() => {
        const loadOptions = async () => {
            try {
                console.log("Appel API pour les options...");
                const [locs, arts] = await Promise.all([
                    locationApi.getAll(), 
                    artistTypeApi.getAll()
                ]);
                console.log("Options reçues :", { locs, arts });
                setLocations(locs);
                setAvailableArtists(arts);
            } catch (err) {
                console.error("Erreur de chargement des options :", err);
            }
        };

        loadOptions(); // <--- IL MANQUAIT CETTE LIGNE !
    }, []); // S'exécute une seule fois au montage

    // 2. Deuxième useEffect : Pré-remplir si on est en mode "Edit"
    useEffect(() => {
        if (initialData) {
            setShow({
                ...initialData,
                locationId: initialData.location?.id || "",
                artistTypeIds: initialData.artistTypes?.map((a: any) => a.id) || []
            });
            if (initialData.posterUrl) setPosterPreview(initialData.posterUrl);
        }
    }, [initialData]);

    // Gestion du changement de fichier
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPosterFile(file);
            setPosterPreview(URL.createObjectURL(file));
        }
    };

    // Gestion des cases à cocher (Artistes)
    const handleArtistChange = (id: number) => {
        const newIds = show.artistTypeIds.includes(id)
            ? show.artistTypeIds.filter(item => item !== id)
            : [...show.artistTypeIds, id];
        setShow({ ...show, artistTypeIds: newIds });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        
        // On emballe le JSON dans un Blob pour Spring Boot @RequestPart
        formData.append("show", new Blob([JSON.stringify(show)], { type: 'application/json' }));
        
        if (posterFile) formData.append("poster", posterFile);
        
        onSubmit(formData);
    };

    return (
        <form className={styles["add-show-form"]} onSubmit={handleSubmit}>
            {/* Titre & Description */}
            <div className={styles["form-group"]}>
                <label>Titre</label>
                <input type="text" value={show.title} onChange={(e) => setShow({...show, title: e.target.value})} required />
            </div>

            <div className={styles["form-group"]}>
                <label>Description</label>
                <textarea value={show.description} onChange={(e) => setShow({...show, description: e.target.value})} required />
            </div>

            {/* Sélection du Lieu */}
            <div className={styles["form-group"]}>
                <label>Lieu</label>
                <select value={show.locationId} onChange={(e) => setShow({...show, locationId: Number(e.target.value)})} required>
                    <option value="">-- Choisir un lieu --</option>
                    {locations.map(l => <option key={l.id} value={l.id}>{l.designation}</option>)}
                </select>
            </div>

            {/* Sélection des Artistes (Checkboxes) */}
            <div className={styles["form-group"]}>
                <label>Artistes & Types</label>
                <div className={styles.artistGrid}>
                    {availableArtists.map(a => (
                        <label key={a.id} className={styles.checkboxItem}>
                            <input 
                                type="checkbox" 
                                checked={show.artistTypeIds.includes(a.id)} 
                                onChange={() => handleArtistChange(a.id)} 
                            />
                            {a.artist.firstname} {a.artist.lastname} <small>({a.type.type})</small>
                        </label>
                    ))}
                </div>
            </div>

            {/* Image */}
            <div className={styles["form-group"]}>
                <label>Affiche du spectacle</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            {posterPreview && (
                <div className={styles["poster-preview"]}>
                    <img src={posterPreview} alt="Aperçu" />
                </div>
            )}

            <button type="submit" className={styles["submit-btn"]} disabled={isSubmitting}>
                {isSubmitting ? "Enregistrement..." : mode === "edit" ? "Mettre à jour" : "Créer le spectacle"}
            </button>
        </form>
    );
};

export default AddShowForm;