// tools/oauth2-login.js
import "dotenv/config";
import express from "express";
import open from "open";
import { writeTokenToDisk } from "../utils/canvasAuth.js";

const fetchApi = globalThis.fetch;

const baseUrl = process.env.CANVAS_BASE_URL?.replace(/\/+$/, "");
const clientId = process.env.CANVAS_CLIENT_ID;
const clientSecret = process.env.CANVAS_CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
// Space-separated scopes string, e.g.:
// CANVAS_OAUTH_SCOPE="url:GET|/api/v1/users/self url:GET|/api/v1/courses/:id"
const oauthScope = process.env.CANVAS_OAUTH_SCOPE?.trim();

if (!baseUrl || !clientId || !clientSecret || !redirectUri) {
  console.error(
    "Missing one of: CANVAS_BASE_URL, CANVAS_CLIENT_ID, CANVAS_CLIENT_SECRET, REDIRECT_URI.",
  );
  process.exit(1);
}

const app = express();

app.get("/start", async (_req, res) => {
  const authUrl = new URL(`${baseUrl}/login/oauth2/auth`);
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  if (oauthScope) {
    // Canvas expects space-separated scopes
    authUrl.searchParams.set("scope", oauthScope);
  }

  try {
    await open(authUrl.toString());
    res.send("Opening Canvas login… You can close this tab.");
  } catch (e) {
    console.error("Failed to open browser:", e);
    res
      .status(500)
      .send(
        `Failed to open browser automatically. Visit: ${authUrl.toString()}`,
      );
  }
});

app.get("/callback", async (req, res) => {
  // If Canvas returned an error, surface it clearly
  if (req.query.error) {
    const err = String(req.query.error);
    const desc = String(req.query.error_description || "");
    res
      .status(400)
      .send(
        `OAuth error from Canvas: ${err}${desc ? ` – ${decodeURIComponent(desc)}` : ""}`,
      );
    return;
  }

  const code = req.query.code;
  if (!code) {
    res.status(400).send("Missing authorization code.");
    return;
  }

  try {
    const tokenRes = await fetchApi(`${baseUrl}/login/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
      }),
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      res.status(500).send(`Token exchange failed: ${text}`);
      return;
    }

    const data = await tokenRes.json();
    const expiresAt = Date.now() + (data.expires_in ?? 3600) * 1000;

    writeTokenToDisk({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: expiresAt,
    });

    res.send("Token acquired and saved. You can close this window.");
    setTimeout(() => process.exit(0), 500);
  } catch (err) {
    res.status(500).send(String(err));
  }
});

const port = Number(new URL(redirectUri).port || 3000);
app.listen(port, () => {
  open(`http://localhost:${port}/start`).catch((e) =>
    console.error("Failed to open /start automatically:", e),
  );
});
