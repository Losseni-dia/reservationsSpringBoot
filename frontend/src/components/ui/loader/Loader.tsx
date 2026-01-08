// Chemin : src/components/ui/Loader.tsx
import React from 'react';
import styles from './Loader.module.css';

const Loader: React.FC = () => {
    return (
        <div className={styles.loaderContainer}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
        </div>
    );
};

export default Loader;