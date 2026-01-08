// Chemin : src/components/ui/Toast.tsx
import React, { useEffect } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
    message: string;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000); // Ferme après 3s
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={styles.toastContainer}>
            <div className={styles.toast}>
                <span className={styles.icon}>✔</span>
                {message}
            </div>
        </div>
    );
};

export default Toast;