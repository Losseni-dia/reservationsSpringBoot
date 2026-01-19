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
  const [error, setError] = useState(null);

  // Charger les données existantes au montage du composant
  useEffect(() => {
    const loadShow = async () => {
      try {
        const data = await fetchShowById(id); // Appelle l'API backend (GET /api/spectacles/{id})
        setShowData(data);
      } catch (err) {
        setError('Erreur lors du chargement du spectacle');
      } finally {
        setLoading(false);
      }
    };
    loadShow();
  }, [id]);

  // Gestionnaire de soumission du formulaire
  const handleSubmit = async (formData) => {
    try {
      // Gérer le cas où l'image n'est pas modifiée : ne pas envoyer de fichier vide
      const dataToSend = { ...formData };
      if (!formData.image || formData.image.size === 0) {
        delete dataToSend.image; // Supprime le champ image si elle n'est pas modifiée
      }

      // Mettre à jour le spectacle via l'API backend (PUT /api/spectacles/{id})
      await updateShow(id, dataToSend);

      // Mettre à jour le catalogue après soumission réussie
      updateCatalog();

      // Rediriger vers la liste des spectacles
      navigate('/shows');
    } catch (err) {
      setError('Erreur lors de la mise à jour du spectacle');
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Mettre à jour le spectacle</h1>
      {/* Réutiliser le composant de formulaire en mode édition */}
      <ShowForm
        mode="edit"
        initialData={showData}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditShow;