import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./LanguageSwitcher.module.css";

const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "nl", label: "Nederlands" },
] as const;

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = i18n.language?.split("-")[0] || "fr";

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdown} ref={containerRef}>
      <button
        type="button"
        className={styles.dropdownBtn}
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select language"
      >
        {currentLang.toUpperCase()} ▼
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu} role="listbox">
          {LANGUAGES.map(({ code, label }) => (
            <button
              key={code}
              type="button"
              role="option"
              aria-selected={currentLang === code}
              className={`${styles.dropdownItem} ${currentLang === code ? styles.active : ""}`}
              onClick={() => handleLanguageChange(code)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
