import React, { useState, useEffect } from "react";
import styles from "./ApiKeyManager.module.css";

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
        text: "Veuillez entrer un nom pour la clé.",
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
        setMessage({ text: "Clé générée avec succès !", type: "success" });
      } else {
        setMessage({ text: "Erreur lors de la génération.", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Erreur de connexion.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // --- NOUVELLE FONCTION DE SUPPRESSION ---
  const handleDeleteKey = async (id: number) => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette clé ? Elle ne fonctionnera plus.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/users/keys/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        // Met à jour la liste en retirant la clé supprimée
        setKeys(keys.filter((k) => k.id !== id));
        setMessage({ text: "Clé supprimée définitivement.", type: "success" });
      } else {
        setMessage({ text: "Erreur lors de la suppression.", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Erreur de connexion.", type: "error" });
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
                  <div className={styles.actionButtons}>
                    <button
                      onClick={() => copyToClipboard(key.keyValue)}
                      className={styles.copyBtn}
                    >
                      Copier
                    </button>
                    <button
                      onClick={() => handleDeleteKey(key.id)}
                      className={styles.deleteBtn}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
                <small className={styles.date}>
                  Créée le : {new Date(key.createdAt).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.docSection}>
        <h4>💡 À quoi sert cette clé ?</h4>
        <p className={styles.docText}>
          Cette clé agit comme un <strong>mot de passe secret</strong>. Elle
          permet à d'autres sites (comme votre site vitrine, un blog ou une
          application partenaire) de se connecter de manière sécurisée à notre
          plateforme pour récupérer automatiquement les informations des
          spectacles.
        </p>

        <h5 className={styles.docSubTitle}>Comment l'utiliser ?</h5>
        <ul className={styles.docList}>
          <li className={styles.docListItem}>
            <strong>Pour les utilisateurs réguliers :</strong> Copiez simplement
            votre clé ci-dessus et collez-la dans le champ "Clé API" de l'outil
            que vous souhaitez relier.
          </li>
          <li>
            <strong>Pour les développeurs :</strong> Incluez cette clé dans
            l'en-tête HTTP <code className={styles.inlineCode}>X-API-KEY</code>{" "}
            lors de vos requêtes.
          </li>
        </ul>

        <p className={styles.docFooter}>
          👉 Découvrez toutes les données disponibles sur notre{" "}
          <a
            href="http://localhost:8080/swagger-ui/index.html"
            target="_blank"
            rel="noreferrer"
            className={styles.docLink}
          >
            documentation interactive
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default ApiKeyManager;
