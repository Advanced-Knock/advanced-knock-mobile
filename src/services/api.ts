/**
 * API SERVICE - Centralized API Client
 * 
 * Pattern: SERVICE × API × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (JØHN)
 * 
 * Simple, elegant API service layer
 * Handles errors gracefully, no sensitive data leaks
 * 
 * ∞ AbëONE ∞
 */

interface ApiConfig {
  baseUrl?: string;
  timeout?: number;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
}

class ApiService {
  private baseUrl: string;
  private timeout: number;

  constructor(config: ApiConfig = {}) {
    // Use environment variable or fallback to localhost for development
    const defaultBaseUrl = process.env.EXPO_PUBLIC_API_URL || 
      (__DEV__ ? 'http://localhost:3001/api/advanced-knock-mobile' : 'https://api.advancedknock.com/api/advanced-knock-mobile');
    this.baseUrl = config.baseUrl || defaultBaseUrl;
    this.timeout = config.timeout || 10000;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const method = options.method || 'GET';
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available (from auth context)
    // TODO: Get token from auth context when implemented

    const config: RequestInit = {
      method,
      headers,
      ...(options.body && { body: JSON.stringify(options.body) }),
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      // Graceful error handling - no sensitive data leaks
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please check your connection.');
        }
        throw new Error(`Network error: ${error.message}`);
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  async post<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, headers });
  }

  async put<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, headers });
  }

  async delete<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }
}

// Export singleton instance
export const api = new ApiService();

// Export class for custom instances
export default ApiService;
