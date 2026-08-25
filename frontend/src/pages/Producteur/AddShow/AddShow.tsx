import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AddShowForm from '../ShowForm/ShowForm';
import { showApi } from '../../../services/api';
import styles from '../UpdateShow/EditShow.module.css';

const AddShow = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleCreate = async (formData: FormData) => {
        setLoading(true);
        try {
            // Ton API devrait renvoyer le spectacle créé avec son nouvel ID
            const newShow = await showApi.create(formData);
            
            alert(t("producer.addShow.successCreate"));
            
            // REDIRECTION INTELLIGENTE :
            // On envoie Bob sur la page de modification du spectacle qu'il vient de créer
            // pour qu'il puisse enfin ajouter ses séances.
            navigate(`/producer/dashboard`); 
            
        } catch (err) {
            alert(t("producer.addShow.errorCreate"));
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                {/* On a enlevé le headerFlex avec le bouton calendrier car l'ID n'existe pas encore */}
                <h1 className={styles.header}>{t("producer.addShow.title")}</h1>
                <AddShowForm mode="add" onSubmit={handleCreate} isSubmitting={loading} />
            </div>
        </div>
    );
};

export default AddShow;