import axios from 'axios';
import type { ApiError } from '@/types';

/** Placeholder for the auth token once the backend exposes a login flow. */
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

// Function to get API base URL from runtime config or env var
function getApiBaseUrl(): string {
  if (import.meta.env.DEV) {
    return ''; // Use Vite proxy in development
  }
  
  // Try to get from runtime config (window.config)
  if (typeof window !== 'undefined' && (window as any).config?.apiBaseUrl) {
    return (window as any).config.apiBaseUrl;
  }
  
  // Fallback to build-time env var
  return import.meta.env.VITE_API_BASE_URL || '';
}

export const axiosClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error)),
);

export function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return {
        message: "Le serveur met trop de temps à répondre. Merci de réessayer.",
        isNetworkError: false,
        isTimeout: true,
      };
    }
    if (!error.response) {
      return {
        message: 'Impossible de joindre le serveur. Vérifiez votre connexion internet.',
        isNetworkError: true,
        isTimeout: false,
      };
    }

    const { status, data } = error.response;
    
    // Extraire le faultstring si l'API renvoie ce format d'erreur spécifique
    let serverMessage: string | undefined;
    if (data && typeof data === 'object') {
      if ('fault' in data && typeof data.fault === 'object' && data.fault !== null && 'faultstring' in data.fault) {
        serverMessage = String((data.fault as { faultstring: unknown }).faultstring);
      } else if ('message' in data) {
        serverMessage = String((data as { message: unknown }).message);
      }
    }

    const fieldErrors =
      data && typeof data === 'object' && 'errors' in data
        ? (data as { errors: Record<string, string[]> }).errors
        : undefined;

    return {
      message: serverMessage ?? defaultMessageForStatus(status),
      status,
      isNetworkError: false,
      isTimeout: false,
      fieldErrors,
    };
  }

  return {
    message: "Une erreur inattendue s'est produite.",
    isNetworkError: false,
    isTimeout: false,
  };
}

function defaultMessageForStatus(status: number): string {
  switch (status) {
    case 400:
      return 'Les informations envoyées sont invalides.';
    case 401:
    case 403:
      return "Vous n'êtes pas autorisé à effectuer cette action.";
    case 404:
      return 'Ressource introuvable.';
    case 409:
      return 'Un conflit est survenu (doublon possible).';
    case 500:
    case 502:
    case 503:
      return 'Le serveur rencontre un problème. Merci de réessayer plus tard.';
    default:
      return "Une erreur s'est produite lors de la communication avec le serveur.";
  }
}
