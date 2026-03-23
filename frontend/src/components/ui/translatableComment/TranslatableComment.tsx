import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { translationApi } from "../../../services/api";
import styles from "./TranslatableComment.module.css";

interface TranslatableCommentProps {
  text: string;
  targetLanguage?: string;
  className?: string;
}

/**
 * Displays a comment with a "Translate" button. On success, shows translated text
 * and a "Show original" toggle. On API failure (e.g. 503), shows a short message
 * without breaking the UI.
 */
export const TranslatableComment: React.FC<TranslatableCommentProps> = ({
  text,
  targetLanguage,
  className,
}) => {
  const { t, i18n } = useTranslation();
  const target = targetLanguage ?? i18n.language?.split("-")[0] ?? "fr";

  const [loading, setLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);

  const handleTranslate = useCallback(async () => {
    if (!text?.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const result = await translationApi.translateComment(text, target);
      setTranslatedText(result);
      setShowOriginal(false);
    } catch {
      setError(t("show.translationUnavailable"));
    } finally {
      setLoading(false);
    }
  }, [text, target, loading, t]);

  if (!text?.trim()) {
    return <span className={className}>{text}</span>;
  }

  const displayText = translatedText !== null && !showOriginal ? translatedText : text;
  const hasTranslation = translatedText !== null;

  return (
    <span className={className}>
      <span className={styles.text}>{displayText}</span>
      <span className={styles.actions}>
        {loading && (
          <span className={styles.status}>{t("show.translating")}</span>
        )}
        {!loading && error && (
          <span className={styles.error}>{error}</span>
        )}
        {!loading && !error && !hasTranslation && (
          <button
            type="button"
            onClick={handleTranslate}
            className={styles.linkButton}
          >
            {t("show.translate")}
          </button>
        )}
        {!loading && !error && hasTranslation && (
          <button
            type="button"
            onClick={() => setShowOriginal((prev) => !prev)}
            className={styles.linkButton}
          >
            {showOriginal ? t("show.translate") : t("show.showOriginal")}
          </button>
        )}
      </span>
    </span>
  );
};
