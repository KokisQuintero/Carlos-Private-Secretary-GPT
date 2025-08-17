// index.js (Node + Express, ESM)
// package.json debe tener:  "type": "module"

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Usa TU dominio EXACTO (https, sin slash final)
const DOMAIN = "https://carlos-private-secretary-gpt-production.up.railway.app";
const PORT = process.env.PORT || 8080;

const app = express();

// ---------- CORS ----------
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, OpenAI-Conversation-ID"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());

// ---------- OpenAPI JSON (mínimo, hipercompatible) ----------
const OPENAPI_SPEC = {
  openapi: "3.0.0",
  info: { title: "Private Secretary Actions", version: "1.0.0" },
  servers: [{ url: DOMAIN }], // https, sin "/" final
  paths: {
    "/calendar/search": {
      post: {
        operationId: "searchEvents",
        summary: "Search events (demo)",
        responses: { "200": { description: "OK" } }
      }
    },
    "/gmail/search": {
      post: {
        operationId: "searchEmails",
        summary: "Search emails (demo)",
        responses: { "200": { description: "OK" } }
      }
    },
    "/web/search": {
      post: {
        operationId: "searchWeb",
        summary: "Web search (demo)",
        responses: { "200": { description: "OK" } }
      }
    }
  }
};

// Servimos el OpenAPI en /openapi.json
app.get("/openapi.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).send(JSON.stringify(OPENAPI_SPEC, null, 2));
});

// ---------- Plugin manifest en ruta estándar ----------
const PLUGIN_MANIFEST = {
  schema_version: "v1",
  name_for_human: "Carlos Private Secretary GPT",
  name_for_model: "private_secretary_gpt",
  description_for_human:
    "Asistente privado con acciones para calendario, correos y web (demo).",
  description_for_model:
    "Asistente privado de Carlos. Usa estas acciones para buscar eventos, correos y resultados web (demo).",
  auth: { type: "none" },
  api: {
    type: "openapi",
    url: `${DOMAIN}/openapi.json`
  },
  logo_url: "https://i.ibb.co/4Pm8xT9/secretary.png",
  contact_email: "qcarlosandres@gmail.com",
  legal_info_url: "https://example.com/legal"
};

// Servimos el manifest en la ruta estándar y en la corta por compatibilidad
app.get("/.well-known/ai-plugin.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).send(JSON.stringify(PLUGIN_MANIFEST, null, 2));
});

app.get("/ai-plugin.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).send(JSON.stringify(PLUGIN_MANIFEST, null, 2));
});

// ---------- Endpoints DEMO ----------
app.post("/calendar/search", (req, res) => {
  const { query } = req.body || {};
  return res.json({
    ok: true,
    source: "demo",
    query,
    events: [
      {
        title: "Demo: TAELED803 class",
        start: "2025-08-18T09:00:00Z",
        end: "2025-08-18T11:00:00Z",
        location: "Haymarket 222"
      }
    ]
  });
});

app.post("/gmail/search", (req, res) => {
  const { query, max_results } = req.body || {};
  return res.json({
    ok: true,
    source: "demo",
    query,
    emails: [
      {
        from: "Azmal Khokan",
        subject: "Classroom change TAELED803",
        snippet: "New room 222 from 4–19 Aug"
      },
      {
        from: "CCFO Team",
        subject: "15th Anniversary Details",
        snippet: "Red carpet interviews and outfits"
      }
    ].slice(0, max_results || 10)
  });
});

app.post("/web/search", (req, res) => {
  const { query } = req.body || {};
  return res.json({
    ok: true,
    source: "demo",
    query,
    results: [
      { title: "CCFO 15th Anniversary", url: "https://example.com/ccfo" },
      { title: "PTE Tips", url: "https://example.com/pte" }
    ]
  });
});

// Healthcheck
app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
