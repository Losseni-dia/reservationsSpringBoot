// Chemin : src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// On récupère l'élément root
const rootElement = document.getElementById('root');

// On vérifie s'il existe pour éviter l'erreur TypeScript "null is not assignable"
if (!rootElement) {
    throw new Error("L'élément root n'a pas été trouvé dans le document. Vérifiez votre index.html.");
}

// On crée la racine et on effectue le rendu
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);