// Chemin : src/components/ui/Toast.tsx
import React, { useEffect } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
    message: string;
    // On ajoute la définition du type ici
    type?: 'success' | 'error' | 'info'; 
    onClose: () => void;
}

// On récupère 'type' et on lui donne une valeur par défaut ('info')
const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    // On utilise le type pour changer la classe CSS
    return (
        <div className={`${styles.toastContainer} ${styles[type]}`}>
            <div className={styles.toast}>
                <span className={styles.icon}>
                    {type === 'success' ? '✔' : type === 'error' ? '✖' : 'ℹ'}
                </span>
                {message}
            </div>
        </div>
    );
};

export default Toast;