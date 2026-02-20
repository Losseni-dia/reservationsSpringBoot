import React, { useState, useEffect } from "react";
import styles from "./ApiKeyManager.module.css"; // Import de ton fichier CSS Module

// Définition de la structure d'une clé API pour TypeScript
interface ApiKey {
  id: number;
  name: string;
  keyValue: string;
  createdAt: string;
}

const ApiKeyManager: React.FC = () => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMyKeys();
  }, []);

  const fetchMyKeys = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users/keys", {
        method: "GET",
        credentials: "include", // Indispensable pour l'authentification Spring Security
      });
      if (response.ok) {
        const data = await response.json();
        setKeys(data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des clés:", error);
    }
  };

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      setMessage({
        text: "Veuillez entrer un nom pour la clé.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("http://localhost:8080/api/users/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newKeyName }),
      });

      if (response.ok) {
        const newKey: ApiKey = await response.json();
        setKeys([...keys, newKey]);
        setNewKeyName("");
        setMessage({ text: "Clé générée avec succès !", type: "success" });
      } else {
        setMessage({
          text: "Erreur lors de la génération de la clé.",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({ text: "Erreur de connexion au serveur.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (keyValue: string) => {
    navigator.clipboard.writeText(keyValue);
    setMessage({ text: "Clé copiée dans le presse-papier !", type: "success" });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Gérer mes clés API</h2>
      <p className={styles.description}>
        Utilisez ces clés pour authentifier vos requêtes vers notre API
        publique.
      </p>

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
          placeholder="Nom de la clé (ex: Mon site WordPress)"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          className={styles.input}
        />
        <button type="submit" disabled={loading} className={styles.btn}>
          {loading ? "Génération..." : "Créer une clé"}
        </button>
      </form>

      <div className={styles.keysList}>
        <h3>Mes clés actives</h3>
        {keys.length === 0 ? (
          <p style={{ color: "#aaa" }}>Vous n'avez pas encore de clé API.</p>
        ) : (
          <ul className={styles.list}>
            {keys.map((key) => (
              <li key={key.id} className={styles.keyItem}>
                <span className={styles.keyHeader}>{key.name}</span>
                <div className={styles.keyCodeContainer}>
                  <code className={styles.keyCode}>{key.keyValue}</code>
                  <button
                    onClick={() => copyToClipboard(key.keyValue)}
                    className={styles.copyBtn}
                  >
                    Copier
                  </button>
                </div>
                <small className={styles.date}>
                  Créée le : {new Date(key.createdAt).toLocaleDateString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.docSection}>
        <h4>💡 Comment l'utiliser ?</h4>
        <p>Ajoutez ce header dans vos requêtes HTTP :</p>
        <code style={{ color: "#0dcaf0" }}>X-API-KEY: votre_cle_ici</code>
        <p style={{ marginTop: "10px", fontSize: "0.85rem" }}>
          Documentation détaillée disponible sur{" "}
          <a
            href="http://localhost:8080/swagger-ui/index.html"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#0d6efd" }}
          >
            Swagger UI
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default ApiKeyManager;
