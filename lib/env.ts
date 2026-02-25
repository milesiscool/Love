const requiredVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];

function normalizeEnvValue(value: string) {
  const trimmed = value.trim();
  const singleQuoted = /^'(.*)'$/.exec(trimmed);
  if (singleQuoted) {
    return singleQuoted[1];
  }
  const doubleQuoted = /^"(.*)"$/.exec(trimmed);
  if (doubleQuoted) {
    return doubleQuoted[1];
  }
  return trimmed;
}

export function normalizeInputValue(value: string) {
  return normalizeEnvValue(value);
}

export function assertEnvReady() {
  const missing = requiredVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export function getMetAtUtc() {
  return process.env.MET_AT_UTC ?? '2026-01-01T00:00:00.000Z';
}

export function getViewerPassword() {
  return normalizeEnvValue(process.env.VIEWER_PASSWORD ?? '');
}

export function getAdminPassword() {
  return normalizeEnvValue(process.env.ADMIN_PASSWORD ?? '');
}

export function getViewerCookieSecret() {
  return normalizeEnvValue(process.env.VIEWER_COOKIE_SECRET ?? '');
}

export function getAdminCookieSecret() {
  return normalizeEnvValue(process.env.ADMIN_COOKIE_SECRET ?? '');
}
