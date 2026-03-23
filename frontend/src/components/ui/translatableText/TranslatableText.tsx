import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useTranslate } from "../../../hooks/useTranslate";

interface TranslatableTextProps {
  text: string;
  sourceLang?: string;
  className?: string;
  as?: "span" | "p";
}

export const TranslatableText: React.FC<TranslatableTextProps> = ({
  text,
  sourceLang = "fr",
  className,
  as: Tag = "span",
}) => {
  const { t, i18n } = useTranslation();
  const targetLang = i18n.language?.split("-")[0] || "fr";
  const { translatedText, loading, error, translate } = useTranslate();

  const displayText = translatedText ?? text;
  const needsTranslation = sourceLang !== targetLang && text?.trim().length > 0;

  const handleTranslate = useCallback(() => {
    translate(text, targetLang, sourceLang);
  }, [text, targetLang, sourceLang, translate]);

  if (!text?.trim()) {
    return <Tag className={className}>{text}</Tag>;
  }

  if (!needsTranslation) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className}>
      {displayText}
      {!translatedText && !loading && (
        <button
          type="button"
          onClick={handleTranslate}
          className="btn btn-link btn-sm p-0 ms-1 text-warning text-decoration-none"
          style={{ verticalAlign: "baseline", fontSize: "0.85em" }}
        >
          {t("show.translate")}
        </button>
      )}
      {loading && <span className="text-muted ms-1">...</span>}
      {error && <span className="text-danger small ms-1">({error})</span>}
    </Tag>
  );
};
