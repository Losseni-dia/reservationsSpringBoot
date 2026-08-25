import { loadStripe, Stripe } from "@stripe/stripe-js";

// On récupère la clé depuis les variables d'environnement
// Le "as string" indique à TS que tu es sûr que la clé existe
const publicKey =  import.meta.env?.VITE_STRIPE_PUBLIC_KEY;

if (!publicKey) {
  console.error("La clé publique Stripe est manquante dans le fichier .env !");
}

export const stripePromise: Promise<Stripe | null> = loadStripe(publicKey);
