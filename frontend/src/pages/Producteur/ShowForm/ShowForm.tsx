import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { locationApi, artistTypeApi } from "../../../services/api";
import styles from "./ShowForm.module.css";

interface Props {
    mode?: "add" | "edit";
    initialData?: any; 
    onSubmit: (formData: FormData) => void;
    isSubmitting: boolean;
}

const ShowForm: React.FC<Props> = ({ mode = "add", initialData, onSubmit, isSubmitting }) => {
    const { t } = useTranslation();

    // 1. État principal
    const [show, setShow] = useState({
        title: "",
        description: "",
        locationId: "" as number | "",
        artistTypeIds: [] as number[],
        bookable: true
    });

    // 2. Options et Médias
    const [locations, setLocations] = useState<any[]>([]);
    const [availableArtists, setAvailableArtists] = useState<any[]>([]);
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);
    const [removePoster, setRemovePoster] = useState(false); // Signal de suppression pour Java

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const [locs, arts] = await Promise.all([locationApi.getAll(), artistTypeApi.getAll()]);
                setLocations(locs);
                setAvailableArtists(arts);
            } catch (err) { console.error("Erreur options", err); }
        };
        loadOptions();
    }, []);

    useEffect(() => {
        if (initialData) {
            setShow({
                title: initialData.title || "",
                description: initialData.description || "",
                locationId: initialData.locationId || initialData.location?.id || "",
                artistTypeIds: initialData.artistTypeIds || initialData.artistTypes?.map((a: any) => a.id) || [],
                bookable: initialData.bookable ?? true
            });
            if (initialData.posterUrl) setPosterPreview(initialData.posterUrl);
        }
    }, [initialData]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPosterFile(file);
            setPosterPreview(URL.createObjectURL(file));
            setRemovePoster(false);
        }
    };

    const handleRemoveCurrentPoster = () => {
        setPosterFile(null);
        setPosterPreview(null);
        setRemovePoster(true); // On prévient le backend
    };

    const handleArtistChange = (id: number) => {
        const newIds = show.artistTypeIds.includes(id)
            ? show.artistTypeIds.filter(i => i !== id)
            : [...show.artistTypeIds, id];
        setShow({ ...show, artistTypeIds: newIds });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        
        // On fusionne l'état show avec le flag removePoster
        const payload = { ...show, removePoster };
        
        formData.append("show", new Blob([JSON.stringify(payload)], { type: 'application/json' }));
        if (posterFile) formData.append("poster", posterFile);
        
        onSubmit(formData);
    };

    return (
        <form className={styles["add-show-form"]} onSubmit={handleSubmit}>
            <h2>{mode === "edit" ? t("producer.showForm.titleEdit") : t("producer.showForm.titleAdd")}</h2>
            <p className={styles["form-info"]}>{t("producer.showForm.formInfo")}</p>

            <div className={styles["form-group"]}>
                <label>{t("producer.showForm.labelTitle")}</label>
                <input 
                    type="text" 
                    value={show.title} 
                    onChange={e => setShow({...show, title: e.target.value})} 
                    required 
                />
            </div>

            <div className={styles["form-group"]}>
                <label>{t("producer.showForm.labelDescription")}</label>
                <textarea 
                    value={show.description} 
                    onChange={e => setShow({...show, description: e.target.value})} 
                    required 
                />
            </div>

            <div className={styles["form-group"]}>
                <label>{t("producer.showForm.labelLocation")}</label>
                <select 
                    value={show.locationId} 
                    onChange={e => setShow({...show, locationId: e.target.value === "" ? "" : Number(e.target.value)})}
                    required
                >
                    <option value="">{t("producer.showForm.selectLocation")}</option>
                    {locations.map(l => <option key={l.id} value={l.id}>{l.designation}</option>)}
                </select>
            </div>

            <div className={styles["form-group"]}>
                <label>{t("producer.showForm.labelCasting")}</label>
                <div className={styles.artistGrid}>
                    {availableArtists.map(a => (
                        <label key={a.id} className={styles.checkboxItem}>
                            <input 
                                type="checkbox" 
                                checked={show.artistTypeIds.includes(a.id)} 
                                onChange={() => handleArtistChange(a.id)}
                            />
                            {a.firstname} {a.lastname} <small style={{color: '#777'}}>({a.type})</small>
                        </label>
                    ))}
                </div>
            </div>

            <div className={styles["form-group"]}>
                <label>{t("producer.showForm.labelPoster")}</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            {posterPreview && (
                <div className={styles["poster-preview"]}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img src={posterPreview} alt={t("producer.showForm.posterAlt")} />
                        <button 
                            type="button" 
                            onClick={handleRemoveCurrentPoster}
                            style={{
                                position: 'absolute', top: '-10px', right: '-10px',
                                background: '#dc3545', color: 'white', border: 'none',
                                borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer'
                            }}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            <button type="submit" className={styles["submit-btn"]} disabled={isSubmitting}>
                {isSubmitting ? t("producer.showForm.submitting") : mode === "edit" ? t("producer.showForm.submitUpdate") : t("producer.showForm.submitCreate")}
            </button>
        </form>
    );
};

export default ShowForm;