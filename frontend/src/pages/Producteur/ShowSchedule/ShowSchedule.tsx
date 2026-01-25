import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showApi, representationApi, locationApi } from '../../../services/api';
import { TypePrice } from '../../../types/enums';
import { Show, Location } from '../../../types/models';
import styles from './ShowSchedule.module.css';

const ShowSchedule: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [show, setShow] = useState<Show | null>(null);
    const [locations, setLocations] = useState<Location[]>([]); // Liste des lieux pour le select
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // État pour la nouvelle séance
    const [newRep, setNewRep] = useState({
        when: "",
        locationId: "" as number | "",
        prices: [
            { type: TypePrice.STANDARD, amount: 0 },
            { type: TypePrice.REDUIT, amount: 0 },
            { type: TypePrice.VIP, amount: 0 }
        ]
    });

    const loadInitialData = async () => {
        if (!id) return;
        try {
            // On charge le spectacle ET la liste des lieux en parallèle
            const [showData, locsData] = await Promise.all([
                showApi.getById(Number(id)),
                locationApi.getAll()
            ]);
            
            setShow(showData);
            setLocations(locsData);
            
            // On pré-remplit le lieu de la séance avec celui du spectacle par défaut
            setNewRep(prev => ({ 
                ...prev, 
                locationId: showData.locationId || "" 
            }));
        } catch (err) {
            console.error("Erreur de chargement", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadInitialData(); }, [id]);

    const handlePriceChange = (index: number, value: number) => {
        const updatedPrices = [...newRep.prices];
        updatedPrices[index].amount = value;
        setNewRep({ ...newRep, prices: updatedPrices });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !newRep.when || !newRep.locationId) {
            alert("Veuillez remplir la date et choisir un lieu.");
            return;
        }

        setSubmitting(true);
        try {
            await representationApi.create(Number(id), newRep);
            setNewRep(prev => ({ ...prev, when: "" })); // Reset date
            loadInitialData(); // Recharger pour voir la nouvelle séance dans la liste
            alert("Séance ajoutée !");
        } catch (err) {
            alert("Erreur lors de l'enregistrement. Vérifiez que le lieu est bien défini.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteRep = async (repId: number) => {
        if (!window.confirm("Supprimer cette séance ?")) return;
        try {
            await representationApi.delete(repId);
            loadInitialData();
        } catch (err) {
            alert("Erreur de suppression");
        }
    };

    if (loading) return <div className={styles.loader}>Chargement...</div>;
    if (!show) return <div>Spectacle introuvable.</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={() => navigate(-1)} className={styles.backBtn}>← Retour</button>
                <h1>Programmation : {show.title}</h1>
            </div>

            <div className={styles.grid}>
                {/* Liste à gauche */}
                <div className={styles.listSection}>
                    <h3 className={styles.sectionTitle}>Séances programmées</h3>
                    {show.representations?.length === 0 ? (
                        <p className={styles.empty}>Aucune séance.</p>
                    ) : (
                        <div className={styles.repCardList}>
                            {show.representations?.map((rep) => (
                                <div key={rep.id} className={styles.repItem}>
                                    <div className={styles.repInfo}>
                                        <span className={styles.date}>
                                            🗓 {new Date(rep.when).toLocaleDateString('fr-BE', { day: '2-digit', month: 'long' })}
                                        </span>
                                        <span className={styles.time}>
                                            🕒 {new Date(rep.when).toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <small style={{color: '#888'}}>{rep.locationDesignation}</small>
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

                {/* Formulaire à droite */}
                <div className={styles.formSection}>
                    <form className={styles.repForm} onSubmit={handleSave}>
                        <h3 className={styles.sectionTitle}>Ajouter une séance</h3>
                        
                        <div className={styles.field}>
                            <label>Lieu de la représentation</label>
                            <select 
                                value={newRep.locationId}
                                onChange={e => setNewRep({...newRep, locationId: Number(e.target.value)})}
                                required
                            >
                                <option value="">-- Sélectionner un lieu --</option>
                                {locations.map(l => (
                                    <option key={l.id} value={l.id}>{l.designation}</option>
                                ))}
                            </select>
                        </div>

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
                                        min="0" step="0.5"
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