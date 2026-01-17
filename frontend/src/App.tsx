import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Context
import { AuthProvider } from './components/context/AuthContext'; 

// Layout
import Header from './components/layout/header/Header';
import Footer from './components/layout/footer/Footer';

// Pages
import Home from './pages/home/Home';
import ShowDetailsPage from './pages/show/showDetails/ShowDetails';
import LoginPage from './pages/Login/LoginPage';
import ProfilePage from './pages/Profile/ProfilePage';
import ForbiddenPage from './pages/Forbidden/ForbiddenPage';

function App() {
  return (
    /* 1. Le Router enveloppe maintenant l'AuthProvider */
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#141414' }}>
          
          <Header />

          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/show/:slug" element={<ShowDetailsPage />} />
              <Route path="/forbidden" element={<ForbiddenPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;