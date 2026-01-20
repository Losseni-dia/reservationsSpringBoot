const API_BASE_URL = 'http://localhost:8080/api'; 

export const fetchShowById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/spectacles/${id}`);
  if (!response.ok) throw new Error('Erreur de chargement');
  return response.json();
};

export const updateShow = async (id, data) => {
  const formData = new FormData();
  formData.append('nom', data.nom);
  formData.append('description', data.description);
  if (data.image) formData.append('image', data.image); // Envoie seulement si présente

  const response = await fetch(`${API_BASE_URL}/spectacles/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!response.ok) throw new Error('Erreur de mise à jour');
  return response.json();
};