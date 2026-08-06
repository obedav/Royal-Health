const ADMIN_AUTH_KEY = 'rh_admin_auth'

export function getAdminToken(): string | null {
  try {
    const raw = sessionStorage.getItem(ADMIN_AUTH_KEY)
    if (!raw) return null
    const auth: { token: string; expiresAt: number } = JSON.parse(raw)
    if (Date.now() >= auth.expiresAt) {
      sessionStorage.removeItem(ADMIN_AUTH_KEY)
      return null
    }
    return auth.token
  } catch {
    return null
  }
}

export function signOut(): void {
  sessionStorage.removeItem(ADMIN_AUTH_KEY)
  window.location.reload()
}
