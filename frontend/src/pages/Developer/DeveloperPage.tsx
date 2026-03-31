import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../components/context/AuthContext";
import styles from "./DeveloperPage.module.css";
import ApiKeyManager from "../../components/apikeymanager/ApiKeyManager";
import {
  codeExampleCurlBefore,
  codeExampleJs,
  codeExampleJsAfter,
  codeExamplePhpAfter,
  codeExamplePhpBefore,
  codeExamplePythonAfter,
  codeExamplePythonBefore,
  HIGHLIGHT_X_API_KEY_CURL,
  HIGHLIGHT_X_API_KEY_JS,
  HIGHLIGHT_X_API_KEY_PHP,
  HIGHLIGHT_X_API_KEY_PYTHON,
} from "./codeSnippets";

const DeveloperPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showApiKeys, setShowApiKeys] = useState(false);
  const brand = t("layout.footer.brandName");

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {t("developer.title", { brand })}
        </h1>
        <p className={styles.subtitle}>{t("developer.subtitle")}</p>
      </header>

      <section className={styles.section}>
        <h3>{t("developer.sectionWhatTitle")}</h3>
        <p style={{ marginBottom: "1.5rem", color: "#ccc" }}>
          {t("developer.sectionWhatIntro")}
        </p>
        <ul className={styles.useCaseList}>
          <li>
            <strong style={{ color: "#fff" }}>
              {t("developer.uc1Title")}
            </strong>
            <br />
            {t("developer.uc1Body", { brand })}
          </li>
          <li style={{ marginTop: "15px" }}>
            <strong style={{ color: "#fff" }}>
              {t("developer.uc2Title")}
            </strong>
            <br />
            {t("developer.uc2Before")}
            <em>{t("developer.uc2Em")}</em>
            {t("developer.uc2After")}
          </li>
          <li style={{ marginTop: "15px" }}>
            <strong style={{ color: "#fff" }}>
              {t("developer.uc3Title")}
            </strong>
            <br />
            {t("developer.uc3Body")}
          </li>
          <li>{t("developer.ucEtc")}</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h3>{t("developer.tutorialTitle")}</h3>
        <p style={{ marginBottom: "2rem", color: "#ccc" }}>
          {t("developer.tutorialIntro")}
        </p>

        <div className={styles.step}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepContent}>
            <h4>{t("developer.step1Title")}</h4>
            <p>{t("developer.step1P1")}</p>

            {!user ? (
              <div className={styles.loginAlert}>
                {t("developer.step1LoginBefore")}
                <strong>{t("developer.step1LoginBold")}</strong>
                {t("developer.step1LoginAfter")}
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: "#222",
                  padding: "15px",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              >
                <p>
                  {t("developer.step1LoggedBefore")}
                  <strong>{user.login}</strong>
                  {t("developer.step1LoggedAfter")}
                </p>
                <button
                  className={styles.toggleBtn}
                  onClick={() => setShowApiKeys(!showApiKeys)}
                >
                  {showApiKeys
                    ? t("developer.toggleHide")
                    : t("developer.toggleShow")}
                </button>

                {showApiKeys && (
                  <div style={{ marginTop: "1.5rem" }}>
                    <ApiKeyManager />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepNumber}>2</div>
          <div className={styles.stepContent}>
            <h4>{t("developer.step2Title")}</h4>
            <p>
              {t("developer.step2P1a")}
              <strong>{t("developer.termHeaderHttp")}</strong>
              {t("developer.step2P1b")}
              <code style={{ color: "#0dcaf0" }}>X-API-KEY</code>
              {t("developer.step2P1c")}
            </p>
            <p>{t("developer.step2P2")}</p>

            <div className={styles.codeTitle}>
              <span className={styles.codeBadge}>
                {t("developer.codeBadgeFrontend")}
              </span>{" "}
              {t("developer.codeTitleJs")}
            </div>
            <div className={styles.codeExample}>
              {codeExampleJs}
              <span className={styles.codeHighlight}>{HIGHLIGHT_X_API_KEY_JS}</span>
              {codeExampleJsAfter}
            </div>

            <div className={styles.codeTitle}>
              <span className={styles.codeBadge}>
                {t("developer.codeBadgeTerminal")}
              </span>{" "}
              {t("developer.codeTitleCurl")}
            </div>
            <div className={styles.codeExample}>
              {codeExampleCurlBefore}
              <span className={styles.codeHighlight}>{HIGHLIGHT_X_API_KEY_CURL}</span>
            </div>

            <div className={styles.codeTitle}>
              <span className={styles.codeBadge}>
                {t("developer.codeBadgeBackend")}
              </span>{" "}
              {t("developer.codeTitlePhp")}
            </div>
            <div className={styles.codeExample}>
              {codeExamplePhpBefore}
              <span className={styles.codeHighlight}>{HIGHLIGHT_X_API_KEY_PHP}</span>
              {codeExamplePhpAfter}
            </div>

            <div className={styles.codeTitle}>
              <span className={styles.codeBadge}>
                {t("developer.codeBadgeScripting")}
              </span>{" "}
              {t("developer.codeTitlePython")}
            </div>
            <div className={styles.codeExample}>
              {codeExamplePythonBefore}
              <span className={styles.codeHighlight}>
                {HIGHLIGHT_X_API_KEY_PYTHON}
              </span>
              {codeExamplePythonAfter}
            </div>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepContent}>
            <h4>{t("developer.step3Title")}</h4>
            <p>
              {t("developer.step3P1a")}
              <em>{t("developer.step3Quote")}</em>
              {t("developer.step3P1b")}
            </p>
            <p>
              {t("developer.step3P2a")}
              <strong>Swagger</strong>
              {t("developer.step3P2b")}
            </p>

            <ul className={styles.instructionList}>
              <li>{t("developer.instr1")}</li>
              <li>{t("developer.instr2")}</li>
              <li>{t("developer.instr3")}</li>
              <li>{t("developer.instr4")}</li>
            </ul>

            <a
              href="http://localhost:8080/swagger-ui/index.html"
              target="_blank"
              rel="noreferrer"
              className={styles.docLinkBtn}
            >
              {t("developer.linkSwagger")}
            </a>
            
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeveloperPage;
