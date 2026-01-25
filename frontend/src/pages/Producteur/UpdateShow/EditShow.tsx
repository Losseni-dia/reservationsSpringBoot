import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AddShowForm from '../ShowForm/ShowForm';
import { showApi } from '../../../services/api';
import styles from './EditShow.module.css';

const EditShow = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showData, setShowData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (id) {
            showApi.getById(Number(id))
                .then(setShowData)
                .catch(() => alert("Impossible de charger le spectacle"))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleUpdate = async (formData: FormData) => {
        setSubmitting(true);
        try {
            await showApi.update(Number(id), formData);
            // On peut rediriger vers le dashboard ou rester ici avec un message de succès
            alert("Spectacle mis à jour avec succès !");
            navigate('/producer/dashboard');
        } catch (err) { 
            alert("Erreur lors de la mise à jour"); 
        } finally { 
            setSubmitting(false); 
        }
    };

    if (loading) return <div className={styles.loader}>Chargement...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.headerFlex}>
                    {/* LE LIEN VERS LA PROGRAMMATION */}
                    <Link to={`/admin/shows/${id}/schedule`} className={styles.scheduleBtn}>
                        📅 Gérer les séances & prix
                    </Link>
                </div>

                <AddShowForm 
                    mode="edit" 
                    initialData={showData} 
                    onSubmit={handleUpdate} 
                    isSubmitting={submitting} 
                />
            </div>
        </div>
    );
};

export default EditShow;