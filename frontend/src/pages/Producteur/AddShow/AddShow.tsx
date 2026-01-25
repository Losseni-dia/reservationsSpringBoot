import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // On enlève Link qui ne sert plus ici
import AddShowForm from '../ShowForm/ShowForm';
import { showApi } from '../../../services/api';
import styles from '../UpdateShow/EditShow.module.css';

const AddShow = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleCreate = async (formData: FormData) => {
        setLoading(true);
        try {
            // Ton API devrait renvoyer le spectacle créé avec son nouvel ID
            const newShow = await showApi.create(formData);
            
            alert("Spectacle créé avec succès !");
            
            // REDIRECTION INTELLIGENTE :
            // On envoie Bob sur la page de modification du spectacle qu'il vient de créer
            // pour qu'il puisse enfin ajouter ses séances.
            navigate(`/admin/shows/${newShow.id}/edit`); 
            
        } catch (err) {
            alert("Erreur lors de la création");
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                {/* On a enlevé le headerFlex avec le bouton calendrier car l'ID n'existe pas encore */}
                <h1 className={styles.header}>Nouveau Spectacle</h1>
                <AddShowForm mode="add" onSubmit={handleCreate} isSubmitting={loading} />
            </div>
        </div>
    );
};

export default AddShow;