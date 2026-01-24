import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddShowForm from '../AddShowForm/AddShowForm';
import { showApi } from '../../../services/api';
import styles from '../UpdateShow/EditShow.module.css';

const AddShow = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleCreate = async (formData: FormData) => {
    setLoading(true);
    try {
            await showApi.create(formData);
            navigate('/');
        } catch (err) {
            alert("Erreur lors de la création");
        } finally { setLoading(false); }
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <h1 className={styles.header}>Nouveau Spectacle</h1>
                <AddShowForm mode="add" onSubmit={handleCreate} isSubmitting={loading} />
            </div>
        </div>
    );
};
export default AddShow;