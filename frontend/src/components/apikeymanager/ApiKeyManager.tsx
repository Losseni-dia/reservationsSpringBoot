import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./ApiKeyManager.module.css";

interface ApiKey {
  id: number;
  name: string;
  keyValue: string;
  createdAt: string;
}

const ApiKeyManager: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMyKeys();
  }, []);

  const fetchMyKeys = async () => {
    try {
      const response = await fetch("/api/users/keys", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setKeys(data);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      setMessage({
        text: t("apiKeys.nameRequired"),
        type: "error",
      });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("/api/users/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newKeyName }),
      });

      if (response.ok) {
        const newKey: ApiKey = await response.json();
        setKeys([...keys, newKey]);
        setNewKeyName("");
        setMessage({ text: t("apiKeys.successGenerated"), type: "success" });
      } else {
        setMessage({ text: t("apiKeys.errorGenerate"), type: "error" });
      }
    } catch (error) {
      setMessage({ text: t("apiKeys.errorConnection"), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKey = async (id: number) => {
    if (!window.confirm(t("apiKeys.confirmDelete"))) {
      return;
    }

    try {
      const response = await fetch(`/api/users/keys/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setKeys(keys.filter((k) => k.id !== id));
        setMessage({ text: t("apiKeys.successDeleted"), type: "success" });
      } else {
        setMessage({ text: t("apiKeys.errorDelete"), type: "error" });
      }
    } catch (error) {
      setMessage({ text: t("apiKeys.errorConnection"), type: "error" });
    }
  };

  const copyToClipboard = (keyValue: string) => {
    navigator.clipboard.writeText(keyValue);
    setMessage({ text: t("apiKeys.copied"), type: "success" });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("apiKeys.title")}</h2>
      <p className={styles.description}>{t("apiKeys.description")}</p>

      {message.text && (
        <div
          className={message.type === "success" ? styles.success : styles.error}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleGenerateKey} className={styles.form}>
        <input
          type="text"
          placeholder={t("apiKeys.placeholderName")}
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          className={styles.input}
        />
        <button type="submit" disabled={loading} className={styles.btn}>
          {loading ? t("apiKeys.generating") : t("apiKeys.createButton")}
        </button>
      </form>

      <div className={styles.keysList}>
        <h3>{t("apiKeys.activeKeysTitle")}</h3>
        {keys.length === 0 ? (
          <p style={{ color: "#aaa" }}>{t("apiKeys.emptyList")}</p>
        ) : (
          <ul className={styles.list}>
            {keys.map((key) => (
              <li key={key.id} className={styles.keyItem}>
                <span className={styles.keyHeader}>{key.name}</span>
                <div className={styles.keyCodeContainer}>
                  <code className={styles.keyCode}>{key.keyValue}</code>
                  <div className={styles.actionButtons}>
                    <button
                      onClick={() => copyToClipboard(key.keyValue)}
                      className={styles.copyBtn}
                    >
                      {t("apiKeys.copy")}
                    </button>
                    <button
                      onClick={() => handleDeleteKey(key.id)}
                      className={styles.deleteBtn}
                    >
                      {t("apiKeys.delete")}
                    </button>
                  </div>
                </div>
                <small className={styles.date}>
                  {t("apiKeys.createdOn", {
                    date: new Date(key.createdAt).toLocaleString(i18n.language),
                  })}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.docSection}>
        <h4>{t("apiKeys.docWhatTitle")}</h4>
        <p className={styles.docText}>{t("apiKeys.docWhatBody")}</p>

        <h5 className={styles.docSubTitle}>{t("apiKeys.docHowTitle")}</h5>
        <ul className={styles.docList}>
          <li className={styles.docListItem}>
            <strong>{t("apiKeys.docHowRegular")}</strong>{" "}
            {t("apiKeys.docHowRegularBody")}
          </li>
          <li>
            <strong>{t("apiKeys.docHowDev")}</strong>{" "}
            {t("apiKeys.docHowDevBody")}{" "}
            <code className={styles.inlineCode}>X-API-KEY</code>{" "}
            {t("apiKeys.docHowDevSuffix")}
          </li>
        </ul>

        <p className={styles.docFooter}>
          {t("apiKeys.docFooterBefore")}{" "}
          <a
            href="http://localhost:8080/swagger-ui/index.html"
            target="_blank"
            rel="noreferrer"
            className={styles.docLink}
          >
            {t("apiKeys.docFooterLink")}
          </a>
          {t("apiKeys.docFooterAfter")}
        </p>
      </div>
    </div>
  );
};

export default ApiKeyManager;
