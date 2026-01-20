import React from 'react';
import './DashbordProducteur.css'; // Import du CSS pour le style rouge

const DashbordProducteur: React.FC = () => {
  // Exemple d'état pour une liste d'éléments (spectacles ou produits)
  const [items, setItems] = React.useState([
    { id: 1, name: 'Spectacle 1' },
    { id: 2, name: 'Spectacle 2' },
  ]);

  // Fonction pour gérer la suppression (adapte avec ton API backend)
  const handleDelete = (id: number) => {
    // Logique de suppression : appelle une API ou filtre la liste
    setItems(items.filter(item => item.id !== id));
    // Exemple d'appel API : await deleteItem(id);
  };

  return (
    <div className="dashboard">
      <h1>Dashboard Producteur</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name}
            {/* Bouton de suppression en rouge */}
            <button className="delete-button" onClick={() => handleDelete(item.id)}>
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashbordProducteur;