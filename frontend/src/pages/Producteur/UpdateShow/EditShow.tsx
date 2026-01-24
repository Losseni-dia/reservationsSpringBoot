import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
        showApi.getById(Number(id)).then(setShowData).finally(() => setLoading(false));
    }, [id]);

    const handleUpdate = async (formData: FormData) => {
        setSubmitting(true);
        try {
            await showApi.update(Number(id), formData);
            navigate('/producteur/dashboard');
        } catch (err) { alert("Erreur MAJ"); } finally { setSubmitting(false); }
    };

    if (loading) return <div className={styles.loader}>Chargement...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <h1 className={styles.header}>Modifier le spectacle</h1>
                <AddShowForm mode="edit" initialData={showData} onSubmit={handleUpdate} isSubmitting={submitting} />
            </div>
        </div>
    );
};
export default EditShow;