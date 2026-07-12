import "server-only";
import crypto from "node:crypto";

export const AUTH_COOKIE = "ak_admin";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Default password lets you log in immediately in dev; override in production
// with ADMIN_PASSWORD (and ADMIN_SESSION_SECRET) in .env.local.
const DEFAULT_PASSWORD = "ak-admin";

function sessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "ak-admin-dev-secret-change-me"
  );
}

function hmac(value: string): string {
  return crypto.createHmac("sha256", sessionSecret()).update(value).digest("hex");
}

export function createToken(): string {
  const exp = String(Date.now() + WEEK_MS);
  return `${exp}.${hmac(exp)}`;
}

export function verifyToken(token?: string | null): boolean {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  const expected = hmac(exp);
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return false;
  }
  const ms = Number(exp);
  return Number.isFinite(ms) && ms > Date.now();
}

export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
  const a = Buffer.from(String(password));
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export const COOKIE_MAX_AGE = WEEK_MS / 1000;
