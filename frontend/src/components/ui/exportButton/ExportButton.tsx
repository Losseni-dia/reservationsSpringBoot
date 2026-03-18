import React, { useState } from 'react';
import styles from './ExportButton.module.css';

interface Props {
  type: string;
  label?: string;
}

const ExportButton: React.FC<Props> = ({ type, label = 'Exporter' }) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async (format: 'csv' | 'json') => {
    setLoading(true);
    try {
      const csrfToken = `; ${document.cookie}`.split(`; XSRF-TOKEN=`).pop()?.split(';').shift();
      const headers: HeadersInit = csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {};

      const res = await fetch(`/api/admin/export/${type}?format=${format}`, {
        credentials: 'include',
        headers,
      });

      if (!res.ok) throw new Error(`Erreur ${res.status}`);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed:', e);
      alert('Une erreur est survenue lors de l\'export.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.group}>
      <button
        disabled={loading}
        onClick={() => handleExport('csv')}
        className={styles.btn}
        title={`${label} au format CSV`}
      >
        {loading ? '...' : `${label} CSV`}
      </button>
      <button
        disabled={loading}
        onClick={() => handleExport('json')}
        className={styles.btn}
        title={`${label} au format JSON`}
      >
        {loading ? '...' : 'JSON'}
      </button>
    </div>
  );
};

export default ExportButton;