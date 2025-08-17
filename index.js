// index.js (Node + Express, ESM)
// Asegúrate de que en package.json tengas:  "type": "module"

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ---------- CORS (en el MISMO archivo) ----------
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
// ------------------------------------------------

app.use(express.json());

// ---------- Rutas para servir archivos del plugin con Content-Type correcto ----------
app.get("/openapi.yaml", (req, res) => {
  res.setHeader("Content-Type", "application/yaml; charset=utf-8");
  res.sendFile(path.join(__dirname, "openapi.yaml"));
});

app.get("/ai-plugin.json", (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.sendFile(path.join(__dirname, "ai-plugin.json"));
});

// (Opcional) servir otros archivos estáticos (README, etc.)
app.use(express.static(__dirname));
// ------------------------------------------------------------------------------------

// ---------- Endpoints DEMO (para validar Actions) ----------
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
// ------------------------------------------------------------

// Healthcheck (útil para Railway)
app.get("/health", (_req, res) => res.json({ ok: true }));

// Puerto (Railway usa PORT, a veces 8080)
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));
