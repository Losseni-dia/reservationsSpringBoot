import React, { useEffect, useState } from 'react';
import { showApi } from '../../../services/api';
import { Show } from '../../../types/models';
import ShowCard from '../../../components/showcard/ShowCard';
import Loader from '../../../components/ui/loader/Loader';
import styles from './ShowList.module.css';

const ShowListPage: React.FC = () => {
    const [shows, setShows] = useState<Show[]>([]);
    const [filteredShows, setFilteredShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        showApi.getAll()
            .then(data => {
                setShows(data);
                setFilteredShows(data);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
            });
    }, []);

    // Logique de recherche
    useEffect(() => {
        const results = shows.filter(show =>
            show.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            show.locationDesignation?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredShows(results);
    }, [searchTerm, shows]);

    if (loading) return <Loader />;

    return (
        <div className={styles.pageWrapper}>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
                    <h1 className={styles.sectionTitle}>Programmation</h1>
                    
                    {/* BARRE DE RECHERCHE */}
                    <div className={styles.searchContainer}>
                        <input 
                            type="text" 
                            placeholder="Rechercher un spectacle ou un lieu..." 
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className={styles.searchIcon}>🔍</span>
                    </div>
                </div>

                {filteredShows.length === 0 ? (
                    <div className="text-center mt-5">
                        <p className="text-white opacity-50">Aucun résultat pour "{searchTerm}"</p>
                    </div>
                ) : (
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-4 g-4">
                        {filteredShows.map(show => (
                            <div className="col" key={show.id}>
                                <ShowCard show={show} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShowListPage;