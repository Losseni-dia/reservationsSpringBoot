import React, { useState, FormEvent, useEffect } from "react";
import { locationApi, artistTypeApi } from "../../../services/api";
import styles from "./ShowForm.module.css";

interface Props {
    mode?: "add" | "edit";
    initialData?: any; 
    onSubmit: (formData: FormData) => void;
    isSubmitting: boolean;
}

const ShowForm: React.FC<Props> = ({ mode = "add", initialData, onSubmit, isSubmitting }) => {
    const [show, setShow] = useState({
        title: "",
        description: "",
        locationId: "" as number | "",
        artistTypeIds: [] as number[],
        bookable: true
    });

    const [locations, setLocations] = useState<any[]>([]);
    const [availableArtists, setAvailableArtists] = useState<any[]>([]);
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);

    // 1. Charger les options globales
    useEffect(() => {
        const loadOptions = async () => {
            const [locs, arts] = await Promise.all([locationApi.getAll(), artistTypeApi.getAll()]);
            setLocations(locs);
            setAvailableArtists(arts);
        };
        loadOptions();
    }, []);

    // 2. Pré-remplissage lors de l'édition
    useEffect(() => {
        if (initialData) {
            setShow({
                title: initialData.title || "",
                description: initialData.description || "",
                locationId: initialData.locationId || "", // Correspond au ShowDTO
                artistTypeIds: initialData.artistTypeIds || [], // Correspond au ShowDTO
                bookable: initialData.bookable ?? true
            });
            if (initialData.posterUrl) setPosterPreview(initialData.posterUrl);
        }
    }, [initialData]);

    const handleArtistChange = (id: number) => {
        const newIds = show.artistTypeIds.includes(id)
            ? show.artistTypeIds.filter(i => i !== id)
            : [...show.artistTypeIds, id];
        setShow({ ...show, artistTypeIds: newIds });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("show", new Blob([JSON.stringify(show)], { type: 'application/json' }));
        if (posterFile) formData.append("poster", posterFile);
        onSubmit(formData);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder="Titre"
                value={show.title} 
                onChange={e => setShow({...show, title: e.target.value})} 
                required 
            />

            <select 
                value={show.locationId} 
                onChange={e => setShow({...show, locationId: Number(e.target.value)})}
                required
            >
                <option value="">-- Sélectionner un lieu --</option>
                {locations.map(l => <option key={l.id} value={l.id}>{l.designation}</option>)}
            </select>

            <div className={styles.artistList}>
                {availableArtists.map(a => (
                    <label key={a.id}>
                        <input 
                            type="checkbox" 
                            checked={show.artistTypeIds.includes(a.id)} 
                            onChange={() => handleArtistChange(a.id)}
                        />
                        {a.firstname} {a.lastname} ({a.type})
                    </label>
                ))}
            </div>

            <input type="file" onChange={e => setPosterFile(e.target.files?.[0] || null)} />
            
            <button type="submit" disabled={isSubmitting}>
                {mode === "edit" ? "Mettre à jour" : "Créer"}
            </button>
        </form>
    );
};

export default ShowForm;