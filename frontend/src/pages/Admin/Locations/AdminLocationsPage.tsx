import React, { useEffect, useState } from 'react';
import { locationApi } from '../../../services/api';
import styles from './AdminLocationsPage.module.css';

interface Location {
    id: number;
    designation: string;
    address: string;
    website: string | null;
    localityName: string;
}

const LocationList: React.FC = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        locationApi.getAll()
            .then(setLocations)
            .catch(err => console.error("Erreur lieux:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className={styles.loader}>Chargement des lieux...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Nos <span className={styles.yellow}>Lieux</span></h1>
            <div className={styles.grid}>
                {locations.map(loc => (
                    <div key={loc.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cityBadge}>{loc.localityName}</span>
                            <h2 className={styles.designation}>{loc.designation}</h2>
                        </div>
                        <div className={styles.cardBody}>
                            <p className={styles.address}>📍 {loc.address}</p>
                            {loc.website && (
                                <a href={loc.website} target="_blank" rel="noopener noreferrer" className={styles.webLink}>
                                    Visiter le site web →
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LocationList;