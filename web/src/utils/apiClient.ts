/**
 * Centralized API & Exception Handling Client
 * Handles timeouts, network dropouts, database offline states, and standard error classification.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error: string | null;
  statusCode: number;
  isDbOffline: boolean;
  isNetworkError: boolean;
  isTimeout: boolean;
  raw?: any;
}

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
}

export class AppError extends Error {
  statusCode: number;
  isDbOffline: boolean;
  isNetworkError: boolean;
  isTimeout: boolean;

  constructor(message: string, options: Partial<AppError> = {}) {
    super(message);
    this.name = 'AppError';
    this.statusCode = options.statusCode || 500;
    this.isDbOffline = options.isDbOffline || false;
    this.isNetworkError = options.isNetworkError || false;
    this.isTimeout = options.isTimeout || false;
  }
}

/**
 * Executes a fetch request with timeout, retries, and comprehensive exception handling.
 */
export async function apiRequest<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    timeoutMs = 12000,
    retries = 1,
    retryDelayMs = 800,
    headers = {},
    ...restOptions
  } = options;

  let attempt = 0;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      // Attach auth token if present
      const token = localStorage.getItem('pooja_sethu_token') || localStorage.getItem('jwt_token');
      const authHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers as Record<string, string>)
      };

      const response = await fetch(url, {
        ...restOptions,
        headers: authHeaders,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type') || '';
      let json: any = null;
      if (contentType.includes('application/json')) {
        json = await response.json();
      } else {
        const text = await response.text();
        try {
          json = JSON.parse(text);
        } catch {
          json = { message: text };
        }
      }

      if (!response.ok) {
        const errorMsg = json?.message || json?.error || `Request failed with status ${response.status}`;
        const isDbOffline = response.status === 503 ||
          response.status === 500 && (
            errorMsg.toLowerCase().includes('connection') ||
            errorMsg.toLowerCase().includes('timeout') ||
            errorMsg.toLowerCase().includes('database') ||
            errorMsg.toLowerCase().includes('econnrefused')
          );

        return {
          success: false,
          data: null,
          error: errorMsg,
          statusCode: response.status,
          isDbOffline: !!isDbOffline,
          isNetworkError: false,
          isTimeout: false
        };
      }

      return {
        success: true,
        data: json?.data !== undefined ? json.data : json,
        raw: json,
        error: null,
        statusCode: response.status,
        isDbOffline: false,
        isNetworkError: false,
        isTimeout: false
      };
    } catch (err: any) {
      clearTimeout(timeoutId);

      const isTimeout = err.name === 'AbortError';
      const isNetworkError = !isTimeout && (
        err.name === 'TypeError' ||
        err.message?.includes('Failed to fetch') ||
        err.message?.includes('NetworkError') ||
        err.message?.includes('Load failed')
      );

      // Retry transient network failures if attempts remain
      if (attempt < retries && (isTimeout || isNetworkError)) {
        attempt++;
        await new Promise(r => setTimeout(r, retryDelayMs * attempt));
        continue;
      }

      let errorMsg = 'An unexpected error occurred.';
      if (isTimeout) {
        errorMsg = 'Server response timed out. Your database or server may be slow or offline.';
      } else if (isNetworkError) {
        errorMsg = 'Network connection failed. Please check your internet or local server connection.';
      } else if (err.message) {
        errorMsg = err.message;
      }

      return {
        success: false,
        data: null,
        error: errorMsg,
        statusCode: isTimeout ? 504 : 0,
        isDbOffline: isTimeout || isNetworkError,
        isNetworkError,
        isTimeout
      };
    }
  }

  return {
    success: false,
    data: null,
    error: 'Maximum retry attempts exceeded.',
    statusCode: 0,
    isDbOffline: true,
    isNetworkError: true,
    isTimeout: false
  };
}
