import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AddShowForm from '../ShowForm/ShowForm';
import { showApi } from '../../../services/api';
import styles from './EditShow.module.css';

const EditShow = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [showData, setShowData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (id) {
            showApi.getById(Number(id))
                .then(setShowData)
                .catch(() => alert(t("producer.editShow.errorLoad")))
                .finally(() => setLoading(false));
        }
    }, [id, t]);

    const handleUpdate = async (formData: FormData) => {
        setSubmitting(true);
        try {
            await showApi.update(Number(id), formData);
            // On peut rediriger vers le dashboard ou rester ici avec un message de succès
            alert(t("producer.editShow.successUpdate"));
            navigate('/producer/dashboard');
        } catch (err) { 
            alert(t("producer.editShow.errorUpdate")); 
        } finally { 
            setSubmitting(false); 
        }
    };

    if (loading) return <div className={styles.loader}>{t("producer.editShow.loading")}</div>;

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.headerFlex}>
                    {/* LE LIEN VERS LA PROGRAMMATION */}
                    <Link to={`/admin/shows/${id}/schedule`} className={styles.scheduleBtn}>
                        {t("producer.editShow.manageSchedule")}
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