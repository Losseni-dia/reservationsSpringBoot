import React, { useState } from "react";
import { useAuth } from "../../components/context/AuthContext";
import styles from "./DeveloperPage.module.css";
import ApiKeyManager from "../../components/apikeymanager/ApiKeyManager";
import { Link } from "react-router-dom";

const DeveloperPage: React.FC = () => {
  const { user } = useAuth();
  const [showApiKeys, setShowApiKeys] = useState(false);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          API SmartBooking : Le guide pour bien démarrer
        </h1>
        <p className={styles.subtitle}>
          Vous débutez avec les API ? Pas de panique ! Voici comment connecter
          votre site web, votre blog ou votre application à notre base de
          données de spectacles en quelques minutes.
        </p>
      </header>

      <section className={styles.section}>
        <h3>💡 À quoi ça sert concrètement ?</h3>
        <p style={{ marginBottom: "1.5rem", color: "#ccc" }}>
          Une API, c'est comme un pont entre notre site et le vôtre. Elle permet
          à vos outils de venir "lire" nos informations en temps réel. Voici 3
          exemples concrets :
        </p>
        <ul className={styles.useCaseList}>
          <li>
            <strong style={{ color: "#fff" }}>
              Fini la double saisie (Pour les théâtres et compagnies) :
            </strong>
            <br />
            Vous avez un site web WordPress ? Au lieu de recopier vos dates de
            tournée à la main chez vous ET sur SmartBooking, l'API permet à
            votre site web de lire notre calendrier. Modifiez une date sur
            SmartBooking, elle se mettra à jour toute seule sur votre site !
          </li>
          <li style={{ marginTop: "15px" }}>
            <strong style={{ color: "#fff" }}>
              Enrichir vos pages (Pour les éditeurs et blogueurs) :
            </strong>
            <br />
            Vous parlez d'un texte de théâtre sur votre blog ? Utilisez notre
            API pour afficher automatiquement un petit encart{" "}
            <em>"En ce moment à l'affiche"</em> afin de dire à vos lecteurs dans
            quels théâtres la pièce se joue en ce moment.
          </li>
          <li style={{ marginTop: "15px" }}>
            <strong style={{ color: "#fff" }}>
              Créer de vrais projets (Pour les apprentis développeurs) :
            </strong>
            <br />
            Marre d'utiliser de fausses données (Lorem Ipsum) pour vos travaux
            d'école ? Connectez-vous à notre API pour construire des
            applications avec de vraies données culturelles (un agenda, une
            carte interactive des lieux...) et boostez votre portfolio.
          </li>
          <li>etc...</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h3>🚀 Tutoriel de démarrage rapide</h3>
        <p style={{ marginBottom: "2rem", color: "#ccc" }}>
          Pour interroger notre serveur, vous ne pouvez pas juste taper l'URL
          dans votre navigateur. Vous devez prouver que vous avez
          l'autorisation. Suivez ces 3 étapes :
        </p>

        {/* ÉTAPE 1 : LA CLÉ */}
        <div className={styles.step}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepContent}>
            <h4>Générez votre clé secrète</h4>
            <p>
              Cette clé est votre passeport. Ne la partagez jamais publiquement
              (ne la mettez pas sur GitHub par exemple).
            </p>

            {!user ? (
              <div className={styles.loginAlert}>
                👉 Veuillez vous <strong>connecter</strong> à votre compte pour
                pouvoir générer une clé.
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
                  Super <strong>{user.login}</strong>, vous êtes connecté !
                  Créez votre clé maintenant :
                </p>
                <button
                  className={styles.toggleBtn}
                  onClick={() => setShowApiKeys(!showApiKeys)}
                >
                  {showApiKeys
                    ? "Masquer le gestionnaire"
                    : "Ouvrir le gestionnaire de clés API"}
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

        {/* ÉTAPE 2 : LE CODE */}
        <div className={styles.step}>
          <div className={styles.stepNumber}>2</div>
          <div className={styles.stepContent}>
            <h4>Faites votre première requête (Appel API)</h4>
            <p>
              Pour prouver qui vous êtes à notre serveur, vous devez glisser
              votre clé dans l'en-tête (<strong>Header HTTP</strong>) de votre
              requête. Ce Header s'appelle obligatoirement{" "}
              <code style={{ color: "#0dcaf0" }}>X-API-KEY</code>.
            </p>
            <p>
              Choisissez le langage qui correspond à votre projet et copiez le
              code :
            </p>

            {/* Exemple 1 : JavaScript */}
            <div className={styles.codeTitle}>
              <span className={styles.codeBadge}>Frontend</span> JavaScript /
              React / Vue
            </div>
            <div className={styles.codeExample}>
              {`// 1. Définissez l'URL que vous souhaitez interroger
const apiUrl = 'http://localhost:8080/api/public/shows';

// 2. Lancez la requête en ajoutant le fameux Header
fetch(apiUrl, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        `}
              <span className={styles.codeHighlight}>
                'X-API-KEY': 'sk_VOTRE_CLE_SECRETE_ICI'
              </span>
              {`
    }
})
.then(res => res.json())
.then(data => console.log("🎉 Spectacles :", data))
.catch(err => console.error("❌ Erreur :", err));`}
            </div>

            {/* Exemple 2 : cURL */}
            <div className={styles.codeTitle}>
              <span className={styles.codeBadge}>Terminal</span> Test rapide
              avec cURL
            </div>
            <div className={styles.codeExample}>
              {`# Collez ceci directement dans l'invite de commande (Terminal / Bash)
curl -X GET "http://localhost:8080/api/public/shows" \\
     -H "Accept: application/json" \\
     -H `}
              <span className={styles.codeHighlight}>
                "X-API-KEY: sk_VOTRE_CLE_SECRETE_ICI"
              </span>
            </div>

            {/* Exemple 3 : PHP */}
            <div className={styles.codeTitle}>
              <span className={styles.codeBadge}>Backend</span> PHP (Idéal pour
              WordPress)
            </div>
            <div className={styles.codeExample}>
              {`<?php
$url = "http://localhost:8080/api/public/shows";

// Préparation du Header avec votre clé
$options = [
    "http" => [
        "header" => `}
              <span className={styles.codeHighlight}>
                "X-API-KEY: sk_VOTRE_CLE_SECRETE_ICI\\r\\n"
              </span>
              {`
    ]
];

$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);

$spectacles = json_decode($response, true);
print_r($spectacles);
?>`}
            </div>

            {/* Exemple 4 : Python */}
            <div className={styles.codeTitle}>
              <span className={styles.codeBadge}>Scripting</span> Python
              (Librairie requests)
            </div>
            <div className={styles.codeExample}>
              {`import requests

url = "http://localhost:8080/api/public/shows"
headers = {
    `}
              <span className={styles.codeHighlight}>
                "X-API-KEY": "sk_VOTRE_CLE_SECRETE_ICI"
              </span>
              {`
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    print("🎉 Données reçues :", response.json())
else:
    print("❌ Erreur :", response.status_code)`}
            </div>
          </div>
        </div>

        {/* ÉTAPE 3 : LA DOCUMENTATION SWAGGER EXPLIQUÉE COMME À UN ENFANT */}
        <div className={styles.step}>
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepContent}>
            <h4>Explorez le dictionnaire de l'API (Swagger)</h4>
            <p>
              Maintenant que vous savez comment interroger notre serveur, vous
              vous demandez sûrement :{" "}
              <em>
                "Quelles sont les adresses exactes ? Que vais-je recevoir comme
                information ?"
              </em>
              .
            </p>
            <p>
              C'est le rôle de <strong>Swagger</strong>. C'est une interface
              visuelle qui liste toutes nos données et vous permet de les tester
              en direct ! Voici comment faire pas à pas :
            </p>

            <ul className={styles.instructionList}>
              <li>
                <strong>1. La connexion 🔓 :</strong> Ouvrez Swagger via le lien
                ci-dessous. En haut à droite, cliquez sur le bouton vert{" "}
                <strong>"Authorize"</strong>.
              </li>
              <li>
                <strong>2. Votre badge 🔑 :</strong> Une fenêtre s'ouvre. Collez
                votre clé (<code style={{ color: "#0dcaf0" }}>sk_...</code>)
                dans le champ texte, cliquez sur "Authorize", puis fermez la
                fenêtre ("Close"). Le cadenas est maintenant fermé !
              </li>
              <li>
                <strong>3. Ouvrez une adresse 📂 :</strong> Cliquez sur une
                ligne de votre choix (par exemple la ligne bleue{" "}
                <code>GET /api/shows</code>) pour la dérouler.
              </li>
              <li>
                <strong>4. Le test magique 🎯 :</strong> Cliquez sur le bouton{" "}
                <strong>"Try it out"</strong> (Essayer), puis sur le gros bouton
                bleu <strong>"Execute"</strong>. Regardez juste en dessous :
                notre serveur vient de vous répondre en direct avec les vraies
                données !
              </li>
            </ul>

            <a
              href="http://localhost:8080/swagger-ui/index.html"
              target="_blank"
              rel="noreferrer"
              className={styles.docLinkBtn}
            >
              Ouvrir le dictionnaire visuel (Swagger)
            </a>
            <Link to="/api-documentation" className={styles.docLinkBtn}>
              Ouvrir la documentation interactive
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeveloperPage;
