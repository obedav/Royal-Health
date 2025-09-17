// src/utils/secureStorage.ts - Secure token storage utilities

interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

class SecureTokenStorage {
  private static readonly ACCESS_TOKEN_KEY = 'auth_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'auth_refresh_token';
  private static readonly EXPIRY_KEY = 'auth_token_expiry';

  /**
   * Store tokens securely
   */
  static setTokens(tokens: TokenData): void {
    try {
      // Store in sessionStorage for better security (cleared on browser close)
      sessionStorage.setItem(this.ACCESS_TOKEN_KEY, this.encrypt(tokens.accessToken));

      if (tokens.refreshToken) {
        sessionStorage.setItem(this.REFRESH_TOKEN_KEY, this.encrypt(tokens.refreshToken));
      }

      // Store expiry time
      sessionStorage.setItem(this.EXPIRY_KEY, tokens.expiresAt.toString());

    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to store tokens securely:', error);
      }
      // Fallback to localStorage if sessionStorage fails
      this.fallbackStorage(tokens);
    }
  }

  /**
   * Get access token with validation
   */
  static getAccessToken(): string | null {
    try {
      const token = sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
      const expiryStr = sessionStorage.getItem(this.EXPIRY_KEY);

      if (!token || !expiryStr) {
        return null;
      }

      // Check if token has expired
      const expiresAt = parseInt(expiryStr);
      if (Date.now() >= expiresAt) {
        this.clearTokens();
        return null;
      }

      return this.decrypt(token);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to retrieve access token:', error);
      }
      return null;
    }
  }

  /**
   * Get refresh token
   */
  static getRefreshToken(): string | null {
    try {
      const token = sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
      return token ? this.decrypt(token) : null;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to retrieve refresh token:', error);
      }
      return null;
    }
  }

  /**
   * Check if tokens are valid
   */
  static isTokenValid(): boolean {
    const expiryStr = sessionStorage.getItem(this.EXPIRY_KEY);
    if (!expiryStr) return false;

    const expiresAt = parseInt(expiryStr);
    return Date.now() < expiresAt;
  }

  /**
   * Clear all tokens
   */
  static clearTokens(): void {
    try {
      sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(this.EXPIRY_KEY);

      // Also clear any old localStorage tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to clear tokens:', error);
      }
    }
  }

  /**
   * Basic encryption for client-side storage (better than plain text)
   * Note: This is not cryptographically secure, just obfuscation
   */
  private static encrypt(text: string): string {
    try {
      // Simple base64 encoding with basic obfuscation
      const encoded = btoa(text);
      return encoded.split('').reverse().join('');
    } catch (error) {
      return text; // Fallback to plain text if encoding fails
    }
  }

  /**
   * Decrypt function
   */
  private static decrypt(encryptedText: string): string {
    try {
      // Reverse the encryption process
      const reversed = encryptedText.split('').reverse().join('');
      return atob(reversed);
    } catch (error) {
      return encryptedText; // Fallback if decryption fails
    }
  }

  /**
   * Fallback storage for browsers that don't support sessionStorage
   */
  private static fallbackStorage(tokens: TokenData): void {
    try {
      // Use localStorage as fallback, but with shorter expiry
      localStorage.setItem(this.ACCESS_TOKEN_KEY, this.encrypt(tokens.accessToken));

      if (tokens.refreshToken) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, this.encrypt(tokens.refreshToken));
      }

      // Set shorter expiry for localStorage (1 hour instead of full token lifetime)
      const shortExpiry = Date.now() + (60 * 60 * 1000); // 1 hour
      localStorage.setItem(this.EXPIRY_KEY, shortExpiry.toString());
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('All storage methods failed:', error);
      }
    }
  }
}

export default SecureTokenStorage;