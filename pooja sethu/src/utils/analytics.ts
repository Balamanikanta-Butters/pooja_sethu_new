import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { API_BASE_URL } from './apiBaseUrl';
import { getToken } from './validation';

const SESSION_STORAGE_KEY = 'user_activity_session_id';

type AnalyticsResponse = {
  success: boolean;
  session?: { id: string };
  message?: string;
};

class AnalyticsRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'AnalyticsRequestError';
    this.status = status;
  }
}

let currentSessionId: string | null = null;
let sessionIsActive = false;
let analyticsQueue: Promise<void> = Promise.resolve();

function serialize<T>(operation: () => Promise<T>): Promise<T> {
  const result = analyticsQueue.then(operation);
  analyticsQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

async function readSessionId() {
  if (currentSessionId) return currentSessionId;
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    currentSessionId = window.localStorage.getItem(SESSION_STORAGE_KEY);
  } else if (Platform.OS !== 'web') {
    currentSessionId = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
  }
  return currentSessionId;
}

async function saveSessionId(sessionId: string | null) {
  currentSessionId = sessionId;
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    if (sessionId) window.localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    else window.localStorage.removeItem(SESSION_STORAGE_KEY);
  } else if (Platform.OS !== 'web') {
    if (sessionId) await AsyncStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    else await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

async function request<T>(
  token: string,
  path: string,
  method: 'POST' | 'PUT',
  body?: Record<string, string>,
) {
  const response = await fetch(`${API_BASE_URL}/api/analytics${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data: AnalyticsResponse;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error(`Analytics request returned invalid JSON (${response.status}): ${String(error)}`);
  }
  if (!response.ok || !data.success) {
    throw new AnalyticsRequestError(
      data.message || `Analytics request failed (${response.status}).`,
      response.status,
    );
  }
  return data as T;
}

async function startSession(token: string) {
  const data = await request<AnalyticsResponse>(token, '/sessions', 'POST');
  const sessionId = data.session?.id;
  if (!sessionId) {
    throw new Error('Analytics API did not return the newly created session ID.');
  }
  await saveSessionId(sessionId);
  sessionIsActive = true;
  return sessionId;
}

async function recordPage(token: string, sessionId: string, pagePath: string, pageName: string) {
  await request(
    token,
    `/sessions/${sessionId}/page`,
    'PUT',
    { pagePath, pageName },
  );
}

async function startOrResume(pagePath: string, pageName: string) {
  const token = await getToken();
  if (!token) return;

  const savedSessionId = await readSessionId();
  if (savedSessionId) {
    if (sessionIsActive) {
      await recordPage(token, savedSessionId, pagePath, pageName);
      return;
    }
    try {
      await request(
        token,
        `/sessions/${savedSessionId}/resume`,
        'POST',
        { pagePath, pageName },
      );
      sessionIsActive = true;
      return;
    } catch (error) {
      if (!(error instanceof AnalyticsRequestError) || error.status !== 404) throw error;
      await saveSessionId(null);
    }
  }

  const sessionId = await startSession(token);
  await recordPage(token, sessionId, pagePath, pageName);
}

export function startOrResumeAnalyticsSession(pagePath: string, pageName: string) {
  return serialize(() => startOrResume(pagePath, pageName));
}

export function recordAnalyticsPage(pagePath: string, pageName: string) {
  return serialize(async () => {
    const token = await getToken();
    if (!token) return;

    let sessionId = await readSessionId();
    if (!sessionId) {
      await startOrResume(pagePath, pageName);
      return;
    }
    await recordPage(token, sessionId, pagePath, pageName);
  });
}

export function pauseAnalyticsSession() {
  return serialize(async () => {
    const sessionId = await readSessionId();
    const token = await getToken();
    if (!sessionId || !token) return;
    await request(token, `/sessions/${sessionId}/pause`, 'POST');
    sessionIsActive = false;
  });
}

export function heartbeatAnalyticsSession() {
  return serialize(async () => {
    const sessionId = await readSessionId();
    const token = await getToken();
    if (!sessionId || !token) return;
    await request(token, `/sessions/${sessionId}/heartbeat`, 'POST');
  });
}

export function endAnalyticsSession() {
  return serialize(async () => {
    const sessionId = await readSessionId();
    const token = await getToken();
    try {
      if (sessionId && token) {
        await request(token, `/sessions/${sessionId}/end`, 'POST');
      }
    } finally {
      await saveSessionId(null);
      sessionIsActive = false;
    }
  });
}
