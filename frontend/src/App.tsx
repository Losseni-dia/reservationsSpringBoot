// Chemin : src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Layout
import Header from './components/layout/header/Header';
import Footer from './components/layout/footer/Footer';

// Pages
import Home from './pages/home/Home';
import ShowDetailsPage from './pages/show/showDetails/ShowDetails';

function App() {
  return (
    <Router>
      {/* On utilise flex-column et min-vh-100 pour s'assurer 
          que le footer reste en bas de l'écran 
      */}
      <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#141414' }}>
        
        <Header />

        <main className="flex-grow-1">
          <Routes>
            {/* La page d'accueil contient maintenant la Hero section + la liste */}
            <Route path="/" element={<Home />} />
            
            {/* Page de détails */}
            <Route path="/show/:slug" element={<ShowDetailsPage />} />
          </Routes>
        </main>

        <Footer />
        
      </div>
    </Router>
  );
}

export default App;