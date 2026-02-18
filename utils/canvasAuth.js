// utils/canvasAuth.js
import fs from "fs";
import path from "path";

const fetchApi = globalThis.fetch;

export const TOKEN_FILE = path.resolve(
  process.cwd(),
  "canvas-course-qa-unit.token.json",
);

function minutesRemaining(ms) {
  return Math.max(0, Math.ceil(ms / 60000));
}

export function readTokenFromDisk() {
  try {
    const raw = fs.readFileSync(TOKEN_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed?.access_token || !parsed?.expires_at) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeTokenToDisk(tokenObj) {
  try {
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenObj, null, 2), {
      mode: 0o600,
    });
  } catch {
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenObj, null, 2));
  }
}

export function createAuth() {
  const authMode = process.env.CANVAS_AUTH_MODE;
  const baseUrl = process.env.CANVAS_BASE_URL?.replace(/\/+$/, "");

  if (!authMode) throw new Error("Missing CANVAS_AUTH_MODE, oauth2 or pat");
  if (!baseUrl) throw new Error("Missing CANVAS_BASE_URL.");

  if (authMode === "pat") {
    const token = process.env.CANVAS_TOKEN;
    if (!token) throw new Error("Missing CANVAS_TOKEN (PAT auth).");

    return {
      async getAuthHeader() {
        return { Authorization: `Bearer ${token}` };
      },
    };
  }

  if (authMode === "oauth2") {
    const clientId = process.env.CANVAS_CLIENT_ID;
    const clientSecret = process.env.CANVAS_CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error(
        "Missing CANVAS_CLIENT_ID, CANVAS_CLIENT_SECRET or REDIRECT_URI (OAuth2 auth).",
      );
    }

    const cached = readTokenFromDisk();
    let accessToken = cached?.access_token || null;
    let refreshToken = cached?.refresh_token || null;
    let tokenExpiry = cached?.expires_at || 0;

    async function refreshAccessToken() {
      if (!refreshToken) {
        throw new Error(
          "No refresh_token found. Run `npm run oauth2:login` to obtain tokens.",
        );
      }

      const res = await fetchApi(`${baseUrl}/login/oauth2/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          refresh_token: refreshToken,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`OAuth2 refresh failed: ${text}`);
      }

      const data = await res.json();

      accessToken = data.access_token;
      refreshToken = data.refresh_token || refreshToken;
      tokenExpiry = Date.now() + (data.expires_in ?? 3600) * 1000;

      writeTokenToDisk({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: tokenExpiry,
      });

      return accessToken;
    }

    async function ensureAccessToken() {
      const now = Date.now();
      if (!accessToken) {
        throw new Error(
          "No access token present. Run `npm run oauth2:login` to authenticate.",
        );
      }
      if (now >= tokenExpiry) {
        await refreshAccessToken();
      }
      return accessToken;
    }

    return {
      async getAuthHeader() {
        const token = await ensureAccessToken();
        return { Authorization: `Bearer ${token}` };
      },
    };
  }

  throw new Error(`Unknown CANVAS_AUTH_MODE: ${authMode}`);
}
