import React from 'react';
import ShowListPage from '../show/showList/ShowList'; // Import de ton catalogue


const Home: React.FC = () => {
    return (
        <main style={{ backgroundColor: '#141414', minHeight: '100vh' }}>
            {/* On affiche directement le catalogue sans le texte de bienvenue */}
            <ShowListPage />
        </main>
    );
};

export default Home;