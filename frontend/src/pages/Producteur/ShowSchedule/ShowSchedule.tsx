import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showApi, representationApi } from '../../../services/api';
import { Show, TypePrice } from '../../../types/models';
import styles from './ShowSchedule.module.css';

const ShowSchedule: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [show, setShow] = useState<Show | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // État pour la nouvelle séance
    const [newRep, setNewRep] = useState({
        when: "",
        locationId: "" as number | "",
        prices: [
            { type: "STANDARD" as TypePrice, amount: 0 },
            { type: "REDUIT" as TypePrice, amount: 0 },
            { type: "VIP" as TypePrice, amount: 0 }
        ]
    });

    const loadShowData = async () => {
        if (!id) return;
        try {
            const data = await showApi.getById(Number(id));
            setShow(data);
            // Par défaut, on utilise le lieu du spectacle pour la nouvelle séance
            setNewRep(prev => ({ ...prev, locationId: data.locationId || "" }));
        } catch (err) {
            console.error("Erreur chargement spectacle", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadShowData(); }, [id]);

    const handlePriceChange = (index: number, value: number) => {
        const updatedPrices = [...newRep.prices];
        updatedPrices[index].amount = value;
        setNewRep({ ...newRep, prices: updatedPrices });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !newRep.when) return;

        setSubmitting(true);
        try {
            await representationApi.create(Number(id), newRep);
            setNewRep({ ...newRep, when: "" }); // Reset date après succès
            loadShowData(); // Recharger la liste
            alert("Séance ajoutée avec succès !");
        } catch (err) {
            alert("Erreur lors de l'ajout de la séance");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteRep = async (repId: number) => {
        if (!window.confirm("Supprimer cette séance et ses tarifs ?")) return;
        try {
            await representationApi.delete(repId);
            loadShowData();
        } catch (err) {
            alert("Impossible de supprimer : des réservations existent peut-être.");
        }
    };

    if (loading) return <div className={styles.loader}>Chargement du calendrier...</div>;
    if (!show) return <div>Spectacle introuvable.</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={() => navigate(-1)} className={styles.backBtn}>← Retour</button>
                <h1>Programmation : {show.title}</h1>
            </div>

            <div className={styles.grid}>
                {/* Liste des représentations existantes */}
                <div className={styles.listSection}>
                    <h3 className={styles.sectionTitle}>Séances programmées</h3>
                    {show.representations?.length === 0 ? (
                        <p className={styles.empty}>Aucune séance prévue pour le moment.</p>
                    ) : (
                        <div className={styles.repCardList}>
                            {show.representations?.map((rep) => (
                                <div key={rep.id} className={styles.repItem}>
                                    <div className={styles.repInfo}>
                                        <span className={styles.date}>
                                            🗓 {new Date(rep.when).toLocaleDateString('fr-BE', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </span>
                                        <span className={styles.time}>
                                            🕒 {new Date(rep.when).toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className={styles.priceBadges}>
                                        {rep.prices?.map(p => (
                                            <span key={p.id} className={styles.badge}>{p.type}: {p.amount}€</span>
                                        ))}
                                    </div>
                                    <button onClick={() => handleDeleteRep(rep.id)} className={styles.deleteBtn}>×</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Formulaire d'ajout */}
                <div className={styles.formSection}>
                    <form className={styles.repForm} onSubmit={handleSave}>
                        <h3 className={styles.sectionTitle}>Ajouter une séance</h3>
                        
                        <div className={styles.field}>
                            <label>Date et Heure</label>
                            <input 
                                type="datetime-local" 
                                value={newRep.when} 
                                onChange={e => setNewRep({...newRep, when: e.target.value})}
                                required 
                            />
                        </div>

                        <div className={styles.priceGrid}>
                            <label className={styles.fullWidth}>Grille Tarifaire (€)</label>
                            {newRep.prices.map((p, index) => (
                                <div key={p.type} className={styles.priceInputGroup}>
                                    <span>{p.type}</span>
                                    <input 
                                        type="number" 
                                        min="0"
                                        step="0.5"
                                        value={p.amount} 
                                        onChange={e => handlePriceChange(index, Number(e.target.value))}
                                    />
                                </div>
                            ))}
                        </div>

                        <button type="submit" className={styles.saveBtn} disabled={submitting}>
                            {submitting ? "Enregistrement..." : "Ajouter au calendrier"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ShowSchedule;