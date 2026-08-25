import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { showApi, tagApi } from '../../../services/api';
import { Show } from '../../../types/models';
import ShowCard from '../../../components/showcard/ShowCard';
import Loader from '../../../components/ui/loader/Loader';
import styles from './ShowList.module.css';

const ShowListPage: React.FC = () => {
    const { t } = useTranslation();
    const [shows, setShows] = useState<Show[]>([]);
    const [filteredShows, setFilteredShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");

    // --- RECHERCHE PAR TAG ---
    const [tagKeyword, setTagKeyword] = useState<string>("");
    const [tagResults, setTagResults] = useState<Show[] | null>(null);
    const [tagTotal, setTagTotal] = useState<number>(0);
    const [tagLoading, setTagLoading] = useState<boolean>(false);

    useEffect(() => {
        showApi.getAll()
            .then(data => {
                setShows(data);
                setFilteredShows(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Recherche client-side par titre/lieu
    useEffect(() => {
        if (tagResults !== null) return; // tag search actif, on n'écrase pas
        const results = shows.filter(show =>
            show.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            show.locationDesignation?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredShows(results);
    }, [searchTerm, shows, tagResults]);

    // Recherche par tag (backend) déclenchée à la soumission
    const handleTagSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tagKeyword.trim()) {
            setTagResults(null);
            return;
        }
        setTagLoading(true);
        try {
            const data = await tagApi.searchByTag(tagKeyword.trim());
            setTagResults(data.shows);
            setTagTotal(data.total);
        } catch {
            setTagResults([]);
            setTagTotal(0);
        } finally {
            setTagLoading(false);
        }
    };

    const handleClearTagSearch = () => {
        setTagKeyword("");
        setTagResults(null);
        setTagTotal(0);
    };

    if (loading) return <Loader />;

    const displayedShows = tagResults !== null ? tagResults : filteredShows;
    const isTagMode = tagResults !== null;

    return (
        <div className={styles.pageWrapper}>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <h1 className={styles.sectionTitle}>{t('home.programming')}</h1>

                    {/* RECHERCHE PAR TITRE/LIEU */}
                    {!isTagMode && (
                        <div className={styles.searchContainer}>
                            <input
                                type="text"
                                placeholder={t('home.searchPlaceholder')}
                                className={styles.searchInput}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span className={styles.searchIcon}>🔍</span>
                        </div>
                    )}
                </div>

                {/* RECHERCHE PAR MOT-CLÉ (TAG) */}
                <form onSubmit={handleTagSearch} className={styles.tagSearchBar}>
                    <div className={styles.tagSearchContainer}>
                        <input
                            type="text"
                            placeholder="Rechercher par mot-clé (tag)..."
                            className={styles.searchInput}
                            value={tagKeyword}
                            onChange={(e) => setTagKeyword(e.target.value)}
                        />
                        <button type="submit" className={styles.tagSearchBtn} disabled={tagLoading}>
                            {tagLoading ? '...' : '🏷️ Rechercher'}
                        </button>
                        {isTagMode && (
                            <button type="button" className={styles.tagClearBtn} onClick={handleClearTagSearch}>
                                ✕ Effacer
                            </button>
                        )}
                    </div>
                    {isTagMode && (
                        <p className={styles.tagResultCount}>
                            <strong>{tagTotal}</strong> résultat{tagTotal !== 1 ? 's' : ''} pour le mot-clé <em>"{tagKeyword}"</em>
                        </p>
                    )}
                </form>

                {displayedShows.length === 0 ? (
                    <div className="text-center mt-5">
                        <p className="text-white opacity-50">
                            {isTagMode
                                ? `Aucun spectacle trouvé pour le tag "${tagKeyword}".`
                                : t('home.noResults', { term: searchTerm })}
                        </p>
                    </div>
                ) : (
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-4 g-4">
                        {displayedShows.map(show => (
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
