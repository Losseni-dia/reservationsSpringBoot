import React, { useState } from "react";
import { videoApi } from "../../services/api";
import { Video } from "../../types/models";

const VideosByArtist: React.FC = () => {
  const [lastname, setLastname] = useState("");
  const [result, setResult] = useState<{ artist: string; total: number; videos: Video[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastname.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await videoApi.getByArtist(lastname.trim());
      setResult(data);
    } catch {
      setError("Aucun résultat ou erreur lors de la recherche.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#141414", minHeight: "100vh", padding: "3rem 5%", color: "#fff" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ borderLeft: "5px solid #f5c518", paddingLeft: "1.5rem", marginBottom: "2rem" }}>
          <h1 style={{ fontWeight: 900, margin: 0 }}>
            🎬 Vidéos par <span style={{ color: "#f5c518" }}>artiste</span>
          </h1>
          <p style={{ color: "#a0a0a0", marginTop: "0.5rem" }}>
            Recherchez les vidéos associées à un artiste via son nom de famille.
          </p>
        </div>

        <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          <input
            type="text"
            placeholder="Nom de famille de l'artiste..."
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            style={{
              background: "#1f1f1f", border: "1px solid #444", borderRadius: "8px",
              color: "white", padding: "10px 16px", outline: "none", flex: 1, minWidth: "200px",
            }}
          />
          <button
            type="submit"
            disabled={loading || !lastname.trim()}
            style={{
              background: "#f5c518", color: "#000", border: "none", borderRadius: "8px",
              padding: "10px 22px", fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Recherche..." : "Rechercher"}
          </button>
        </form>

        {error && (
          <p style={{ color: "#f5c518", background: "rgba(245,197,24,0.1)", padding: "10px", borderRadius: "6px" }}>
            {error}
          </p>
        )}

        {result && (
          <div>
            <p style={{ color: "#a0a0a0", marginBottom: "1.5rem" }}>
              <strong style={{ color: "#f5c518" }}>{result.total}</strong> vidéo{result.total !== 1 ? "s" : ""} trouvée{result.total !== 1 ? "s" : ""} pour{" "}
              <strong style={{ color: "white" }}>{result.artist}</strong>
            </p>

            {result.videos.length === 0 ? (
              <p style={{ color: "#888", fontStyle: "italic" }}>Aucune vidéo pour cet artiste.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {result.videos.map((video) => (
                  <li
                    key={video.id}
                    style={{
                      background: "#1f1f1f", border: "1px solid #333", borderRadius: "8px",
                      padding: "1rem 1.25rem", marginBottom: "0.75rem",
                    }}
                  >
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#f5c518", fontWeight: 700, textDecoration: "none", fontSize: "1rem" }}
                    >
                      ▶ {video.title}
                    </a>
                    {video.showTitle && (
                      <p style={{ color: "#a0a0a0", margin: "0.25rem 0 0", fontSize: "0.85rem" }}>
                        Spectacle : {video.showTitle}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideosByArtist;
