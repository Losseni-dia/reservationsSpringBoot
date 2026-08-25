// src/components/ui/importZone/ImportZone.tsx
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./ImportZone.module.css";

interface Props {
  type: string;
  onSuccess?: () => void;
}

const ImportZone: React.FC<Props> = ({ type, onSuccess }) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<{
    imported: number;
    skipped: number;
    errors: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setLoading(true);
    setError(null);
    setReport(null);

    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext !== "csv" && ext !== "json") {
      setError(t("admin.importZone.formatError"));
      setLoading(false);
      return;
    }

    const format = ext;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const csrfToken = `; ${document.cookie}`
        .split(`; XSRF-TOKEN=`)
        .pop()
        ?.split(";")
        .shift();
      const headers: HeadersInit = csrfToken
        ? { "X-XSRF-TOKEN": csrfToken }
        : {};

      const res = await fetch(`/api/admin/import/${type}?format=${format}`, {
        method: "POST",
        headers,
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || t("admin.importZone.importFailed"));
      }

      const result = await res.json();
      setReport(result);
      if (result.imported > 0) onSuccess?.();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.dropZone} ${dragging ? styles.dragging : ""} ${loading ? styles.loading : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) upload(f);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.json"
          className={styles.hiddenInput}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
          }}
          style={{ display: "none" }}
        />

        {loading ? (
          <div className={styles.loadingContent}>
            <div className={styles.spinner} />
            <p>{t("admin.importZone.loading")}</p>
          </div>
        ) : (
          <div className={styles.idleContent}>
            <span className={styles.uploadIcon}>📂</span>
            <p className={styles.dropText}>{t("admin.importZone.dropText")}</p>
            <p className={styles.orText}>{t("admin.importZone.orClick")}</p>
          </div>
        )}
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      {report && (
        <div className={styles.report}>
          <div className={styles.reportHeader}>
            <span className={styles.successCount}>
              ✅ {report.imported} {t("admin.importZone.imported")}
            </span>
            <span className={styles.skippedCount}>
              ⏭ {report.skipped} {t("admin.importZone.skipped")}
            </span>
            {report.errors.length > 0 && (
              <span className={styles.errorCount}>
                ❌ {report.errors.length} {t("admin.importZone.errors")}
              </span>
            )}
          </div>
          {report.errors.length > 0 && (
            <details className={styles.errorDetails}>
              <summary>{t("admin.importZone.seeErrors")}</summary>
              <ul className={styles.errorList}>
                {report.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
};

export default ImportZone;
