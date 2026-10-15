import { useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';
import { usePathname } from 'expo-router';
import {
  heartbeatAnalyticsSession,
  pauseAnalyticsSession,
  recordAnalyticsPage,
  startOrResumeAnalyticsSession,
  AnalyticsRequestError,
} from '../utils/analytics';

const pageNames: Record<string, string> = {
  '/': 'Home',
  '/(tabs)': 'Home',
  '/(tabs)/index': 'Home',
  '/(tabs)/bookings': 'Bookings',
  '/(tabs)/calendar': 'Calendar',
  '/(tabs)/profile': 'Account',
  '/pooja/list': 'Pooja List',
  '/pooja/details': 'Pooja Details',
  '/purohit/list': 'Purohit List',
  '/purohit/details': 'Purohit Details',
  '/booking/summary': 'Booking Summary',
  '/booking/package': 'Booking Package',
};

function getPageName(pagePath: string) {
  if (pageNames[pagePath]) return pageNames[pagePath];
  const routeName = pagePath
    .split('/')
    .filter((segment) => segment && !segment.startsWith('(') && !segment.startsWith('['))
    .reverse()
    .find((segment) => !/^\d+$/.test(segment) && !/^[0-9a-f-]{36}$/i.test(segment));
  if (!routeName) return 'Home';
  return routeName
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function reportAnalyticsError(action: string, error: unknown) {
  if (error instanceof AnalyticsRequestError && error.status === 404) {
    return;
  }
  console.warn(`Analytics ${action} failed:`, error);
}

function isAppActive() {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    return document.visibilityState === 'visible';
  }
  return AppState.currentState === 'active';
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const currentPathRef = useRef(pathname);
  const isActiveRef = useRef(isAppActive());
  const hasInitializedRef = useRef(false);
  currentPathRef.current = pathname;

  useEffect(() => {
    const updateActivity = (active: boolean) => {
      if (isActiveRef.current === active) return;
      isActiveRef.current = active;
      const pagePath = currentPathRef.current;
      const pageName = getPageName(pagePath);
      const operation = active
        ? startOrResumeAnalyticsSession(pagePath, pageName)
        : pauseAnalyticsSession();
      void operation.catch((error) => reportAnalyticsError(active ? 'resume' : 'pause', error));
    };

    const appStateSubscription = AppState.addEventListener('change', (state) => {
      if (Platform.OS !== 'web') {
        updateActivity(state === 'active');
      }
    });

    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined') {
        updateActivity(document.visibilityState === 'visible');
      }
    };
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    const heartbeat = setInterval(() => {
      if (isActiveRef.current) {
        void heartbeatAnalyticsSession().catch((error) => reportAnalyticsError('heartbeat', error));
      }
    }, 15000);

    return () => {
      appStateSubscription.remove();
      clearInterval(heartbeat);
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
      void pauseAnalyticsSession().catch((error) => reportAnalyticsError('pause on unmount', error));
    };
  }, []);

  useEffect(() => {
    if (!isActiveRef.current) return;

    const pageName = getPageName(pathname);
    const operation = hasInitializedRef.current
      ? recordAnalyticsPage(pathname, pageName)
      : startOrResumeAnalyticsSession(pathname, pageName);
    hasInitializedRef.current = true;
    void operation.catch((error) => reportAnalyticsError('page visit', error));
  }, [pathname]);

  return null;
}
