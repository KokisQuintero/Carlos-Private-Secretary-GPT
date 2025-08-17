// index.js (Node + Express, ESM)
// package.json debe tener:  "type": "module"

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = "https://carlos-private-secretary-gpt-production.up.railway.app"; // <-- tu dominio público
const PORT = process.env.PORT || 8080;

const app = express();

// ---------------- CORS (mismo archivo) ----------------
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
// ------------------------------------------------------

app.use(express.json());

// ---------- OpenAPI (JSON) servido en memoria ----------
const OPENAPI_SPEC = {
  openapi: "3.0.1",
  info: { title: "Private Secretary Actions", version: "1.0.0" },
  servers: [{ url: `${DOMAIN}/` }], // barra final ayuda al validador
  paths: {
    "/calendar/search": {
      post: {
        operationId: "searchEvents",
        summary: "Search events (demo)",
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  query: { type: "string" },
                  time_min: { type: "string", format: "date-time" },
                  time_max: { type: "string", format: "date-time" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/gmail/search": {
      post: {
        operationId: "searchEmails",
        summary: "Search emails (demo)",
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  query: { type: "string" },
                  max_results: { type: "integer" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/web/search": {
      post: {
        operationId: "searchWeb",
        summary: "Web search (demo)",
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { query: { type: "string" } }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    }
  }
};

app.get("/openapi.json", (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).send(JSON.stringify(OPENAPI_SPEC, null, 2));
});
// -------------------------------------------------------

// Sirve ai-plugin.json con Content-Type correcto
app.get("/ai-plugin.json", (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.sendFile(path.join(__dirname, "ai-plugin.json"));
});

// (Opcional) servir otros archivos estáticos (README, etc.)
app.use(express.static(__dirname));

// ------------------ Endpoints DEMO ---------------------
app.post("/calendar/search", (req, res) => {
  const { query, time_min, time_max } = req.body || {};
  return res.json({
    ok: true,
    source: "demo",
    query,
    events: [
      {
        title: "Demo: TAELED803 class",
        start: time_min || "2025-08-18T09:00:00Z",
        end: time_max || "2025-08-18T11:00:00Z",
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
// -------------------------------------------------------

// Healthcheck
app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
