// frontend/src/types/models.ts
import { StatutReservation, TypePrice, ShowStatus } from './enums';

export interface Artist {
    id: number;
    firstname: string;
    lastname: string;
    types: string[]; // Liste des types de l'artiste
}


export interface Representation {
  id: number;
  showId: number;
  showTitle?: string;
  when: string; // Format ISO: "2025-12-25T20:00:00"
  locationId?: number;
  locationDesignation?: string;
  prices: Price[]; // Lié à la table 'prices' en Java
}

/**
 * Détails des tarifs pour une représentation
 */
export interface Price {
    id: number;
    type: TypePrice;    // "STANDARD", "VIP", "PREMIUM"
    amount: number;
    startDate: string;
    endDate?: string;
}

/**
 * Utilisateur du système
 */
export interface User {
    id: number;
    login: string;
    firstname: string;
    lastname: string;
    email: string;
    langue: string;
    roles: Role[];
    createdAt: string;
    isActive: boolean;
    roles?: Role[]; // Ajouté pour faciliter l'accès aux rôles de l'utilisateur
}


export interface UserRegistrationDto {
    firstname: string;
    lastname: string;
    login: string;
    email: string;
    password: string;
    confirmPassword: string;
    langue: string;
}

export interface UserProfileDto {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    langue: string;
    login: string;
    role: string;
    password?: string;        // Optionnel lors d'une simple mise à jour
    confirmPassword?: string; // Optionnel lors d'une simple mise à jour
}

/**
 * Rôle utilisateur (Admin, Membre, etc.)
 */
export interface Role {
    id: number;
    role: string; // ex: "ADMIN", "MEMBER"
}

/**
 * Réservation globale effectuée par un utilisateur
 */
export interface Reservation {
    id: number;
    reservationDate: string;
    statut: StatutReservation;
    userId: number;
    items: RepresentationReservation[]; // Détails des places réservées
}

/**
 * Ligne de détail d'une réservation (Table de liaison)
 */
export interface RepresentationReservation {
    id: number;
    representationId: number;
    representationWhen: string;
    showTitle: string;
    priceId: number;
    priceType: TypePrice;
    priceAmount: number;
    quantity: number;
}

/**
 * Objet utilisé pour envoyer une nouvelle réservation au Backend
 * (Correspond à votre ReservationItemRequest Java)
 */
export interface ReservationRequest {
    representationId: number;
    priceId: number;
    places: number;
}



export interface Show {
    id: number;
    slug: string;
    title: string;
    description: string;
    posterUrl: string;
    bookable: boolean;
    status: ShowStatus; // Ajout du statut via Enum
    locationId?: number; // AJOUTE CETTE LIGNE (indispensable pour ShowSchedule)
    locationDesignation: string;
    averageRating?: number;
    reviewCount?: number;
    representations?: Representation[]; 
    reviews?: Review[];
    artists?: Artist[];
    createdAt: string;
}



export interface Locality {
    id: number;
    postalCode: number;
    locality: string;
}

export interface Location {
    id: number;
    designation: string;
    address: string;
    website: string;
    localityName: string;
}

export interface Review {
    id: number;
    authorLogin: string;
    comment: string;
    stars: number;
    createdAt: string; // Les dates JSON arrivent en string ISO
}

export { ShowStatus };
