import { Platform } from 'react-native';

const configuredApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
const apiHost =
  Platform.OS === 'web' && typeof window !== 'undefined'
    ? window.location.hostname
    : '192.168.88.13';

export const API_BASE_URL = (configuredApiBaseUrl || `http://${apiHost}:5000`).replace(/\/+$/, '');
