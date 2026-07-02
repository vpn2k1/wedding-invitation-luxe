export const ADMIN_SESSION_COOKIE = 'admin_session';

export function getAdminSessionToken(username = process.env.ADMIN_USERNAME, password = process.env.ADMIN_PASSWORD) {
  if (!username || !password) {
    return null;
  }

  return encodeURIComponent(`${username}:${password}`);
}

export function isAdminAuthConfigured() {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD);
}
