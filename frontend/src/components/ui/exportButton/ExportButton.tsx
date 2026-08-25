import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ExportButton.module.css';

interface Props {
  type: string;
  label?: string;
}

const ExportButton: React.FC<Props> = ({ type, label }) => {
  const { t } = useTranslation();
  const exportLabel = label ?? t('admin.shows.export');
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
      alert(t('admin.export.errorAlert'));
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
        title={t('admin.export.tooltipCsv', { label: exportLabel })}
      >
        {loading ? '...' : t('admin.export.buttonCsv', { label: exportLabel })}
      </button>
      <button
        type="button"
        disabled={loading}
        onClick={() => handleExport('json')}
        className={styles.btn}
        title={t('admin.export.tooltipJson', { label: exportLabel })}
      >
        {loading ? '...' : t('admin.export.buttonJson')}
      </button>
    </div>
  );
};

export default ExportButton;