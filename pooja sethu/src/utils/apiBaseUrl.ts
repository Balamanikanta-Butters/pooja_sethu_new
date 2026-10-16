import { Platform } from 'react-native';
import Constants from 'expo-constants';

const configuredApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

const getDynamicHost = () => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.location.hostname;
  }
  const hostUri = Constants.expoConfig?.hostUri || (Constants as any).manifest2?.extra?.expoClient?.hostUri;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return host;
    }
  }
  return '192.168.88.8';
};

const apiHost = getDynamicHost();

export const API_BASE_URL = (configuredApiBaseUrl || `http://${apiHost}:5000`).replace(/\/+$/, '');
