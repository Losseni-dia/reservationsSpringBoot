// src/components/ui/importZone/ImportZone.tsx
import React, { useRef, useState } from 'react';
import styles from './ImportZone.module.css';

interface Props { type: string; onSuccess?: () => void; }

const ImportZone: React.FC<Props> = ({ type, onSuccess }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<{imported:number;skipped:number;errors:string[]}|null>(null);
  const [error, setError] = useState<string|null>(null);

  const upload = async (file: File) => {
    setLoading(true); setError(null); setReport(null);
    const format = file.name.endsWith('.json') ? 'json' : 'csv';
    const formData = new FormData();
    formData.append('file', file);
    try {
      const csrfToken = `; ${document.cookie}`.split(`; XSRF-TOKEN=`).pop()?.split(';').shift();
      const headers: HeadersInit = csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {};
      const res = await fetch(`/api/admin/import/${type}?format=${format}`, {
        method: 'POST', headers, body: formData, credentials: 'include'
      });
      if (!res.ok) throw new Error(await res.text());
      const result = await res.json();
      setReport(result);
      if (result.imported > 0) onSuccess?.();
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.dropZone} ${dragging ? styles.dragging : ''} ${loading ? styles.loading : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) upload(f); }}>
        <input ref={inputRef} type="file" accept=".csv,.json" className={styles.hiddenInput}
          onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); }} />
        {loading
          ? <div className={styles.loadingContent}><div className={styles.spinner}/><p>Import en cours...</p></div>
          : <div className={styles.idleContent}><span className={styles.uploadIcon}>📂</span>
              <p className={styles.dropText}>Glissez un fichier CSV ou JSON ici</p>
              <p className={styles.orText}>ou cliquez pour choisir</p></div>}
      </div>
      {error && <div className={styles.errorBanner}>{error}</div>}
      {report && (
        <div className={styles.report}>
          <div className={styles.reportHeader}>
            <span className={styles.successCount}>✅ {report.imported} importé(s)</span>
            <span className={styles.skippedCount}>⏭ {report.skipped} ignoré(s)</span>
            {report.errors.length > 0 && <span className={styles.errorCount}>❌ {report.errors.length} erreur(s)</span>}
          </div>
          {report.errors.length > 0 && (
            <details className={styles.errorDetails}>
              <summary>Voir les erreurs</summary>
              <ul className={styles.errorList}>{report.errors.map((e,i) => <li key={i}>{e}</li>)}</ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
};
export default ImportZone;