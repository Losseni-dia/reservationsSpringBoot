import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ShowForm from './ShowForm'; // Composant de formulaire réutilisable
import { fetchShowById, updateShow } from '../api/shows'; // Fonctions API pour le backend
import { useCatalog } from '../context/CatalogContext'; // Contexte pour le catalogue

const EditShow = () => {
  const { id } = useParams(); // Récupère l'ID depuis les paramètres d'URL
  const navigate = useNavigate();
  const { updateCatalog } = useCatalog(); // Hook pour mettre à jour le catalogue
  const [showData, setShowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Charger les données existantes au montage du composant
  useEffect(() => {
    let mounted = true;
    const loadShow = async () => {
      try {
        const data = await fetchShowById(id); // Appelle l'API backend (GET /api/spectacles/{id})
        if (!mounted) return;
        if (!data) {
          setError('Spectacle introuvable');
          setShowData(null);
        } else {
          setShowData(data);
        }
      } catch (err) {
        console.error('fetchShowById error:', err);
        setError('Erreur lors du chargement du spectacle');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadShow();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Gestionnaire de soumission du formulaire
  const handleSubmit = async (formData) => {
    setError(null);
    setIsSubmitting(true);
    try {
      // Prepare payload:
      // - If image is a File -> send FormData (for multipart upload)
      // - If image is absent or is a string (existing URL), don't include it
      let payload = null;
      const hasFile =
        formData.image && (typeof File !== 'undefined') && formData.image instanceof File;

      if (hasFile) {
        const fd = new FormData();
        // Append other fields. Adjust field names to match backend expectations.
        Object.keys(formData).forEach((key) => {
          if (key === 'image') {
            // only append the file if it's a File
            if (formData.image instanceof File) fd.append('image', formData.image);
          } else if (formData[key] !== undefined && formData[key] !== null) {
            fd.append(key, formData[key]);
          }
        });
        payload = fd;
      } else {
        // No file - send JSON. If image is a string (existing url) we omit it so backend keeps existing image.
        const dataToSend = { ...formData };
        if (!formData.image || typeof formData.image === 'string') {
          delete dataToSend.image;
        }
        payload = dataToSend;
      }

      // Mettre à jour le spectacle via l'API backend (PUT /api/spectacles/{id})
      // Make sure updateShow can detect/formulate the correct Content-Type for FormData vs JSON.
      await updateShow(id, payload);

      // Mettre à jour le catalogue après soumission réussie (si context fourni)
      try {
        if (typeof updateCatalog === 'function') updateCatalog();
      } catch (ctxErr) {
        console.warn('updateCatalog failed:', ctxErr);
      }

      // Rediriger vers la liste des spectacles
      navigate('/shows');
    } catch (err) {
      console.error('updateShow error:', err);
      // Try to show a meaningful server message if available
      const serverMessage = err?.response?.data?.message || err?.message;
      setError(serverMessage || 'Erreur lors de la mise à jour du spectacle');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!showData) return <p>Spectacle introuvable.</p>;

  return (
    <div>
      <h1>Mettre à jour le spectacle</h1>
      {/* Réutiliser le composant de formulaire en mode édition */}
      <ShowForm
        mode="edit"
        initialData={showData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting} // optional - ShowForm can use this to disable the submit button
      />
    </div>
  );
};

export default EditShow;
