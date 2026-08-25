import { useState, useCallback } from "react";
import { translateApi } from "../services/api";

interface UseTranslateResult {
  translatedText: string | null;
  loading: boolean;
  error: string | null;
  translate: (text: string, targetLang: string, sourceLang?: string) => Promise<string>;
  reset: () => void;
}

export const useTranslate = (): UseTranslateResult => {
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = useCallback(
    async (text: string, targetLang: string, sourceLang?: string): Promise<string> => {
      if (!text || !text.trim()) {
        return text;
      }
      setLoading(true);
      setError(null);
      setTranslatedText(null);
      try {
        const result = await translateApi.translate(text, targetLang, sourceLang);
        setTranslatedText(result);
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Translation failed";
        setError(message);
        return text;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setTranslatedText(null);
    setError(null);
  }, []);

  return { translatedText, loading, error, translate, reset };
};
