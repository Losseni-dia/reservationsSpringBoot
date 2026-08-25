import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tagApi } from '../../../services/api';
import { Show } from '../../../types/models';
import ShowCard from '../../../components/showcard/ShowCard';
import Loader from '../../../components/ui/loader/Loader';
import styles from '../../show/showList/ShowList.module.css';

const ShowsWithoutTagPage: React.FC = () => {
    const { tag } = useParams<{ tag: string }>();
    const [shows, setShows] = useState<Show[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!tag) return;
        setLoading(true);
        tagApi.getShowsWithoutTag(tag)
            .then(data => {
                setShows(data.shows);
                setTotal(data.total);
                setLoading(false);
            })
            .catch(() => {
                setError("Impossible de charger les spectacles.");
                setLoading(false);
            });
    }, [tag]);

    if (loading) return <Loader />;

    return (
        <div className={styles.pageWrapper}>
            <div className="container">
                <div className="mb-5">
                    <Link to="/" className="text-warning text-decoration-none small">
                        ← Retour à la programmation
                    </Link>
                    <h1 className={`${styles.sectionTitle} mt-3`}>
                        Spectacles sans le tag <em>"{tag}"</em>
                    </h1>
                    <p style={{ color: '#aaa', marginTop: '0.75rem' }}>
                        <strong style={{ color: '#f5c518' }}>{total}</strong>{' '}
                        spectacle{total !== 1 ? 's' : ''} ne possède{total !== 1 ? 'nt' : ''} pas ce mot-clé.
                    </p>
                </div>

                {error && (
                    <p className="text-danger">{error}</p>
                )}

                {shows.length === 0 && !error ? (
                    <p className="text-white opacity-50 text-center mt-5">
                        Tous les spectacles possèdent le tag "{tag}".
                    </p>
                ) : (
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                        {shows.map(show => (
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

export default ShowsWithoutTagPage;
