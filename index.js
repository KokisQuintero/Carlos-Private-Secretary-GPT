import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Sirve archivos estáticos (openapi.yaml, ai-plugin.json, README.md)
app.use(express.static(__dirname));

// Endpoints DEMO (para pasar validación y hacer pruebas)
app.post("/calendar/search", (req, res) => {
  const { query, time_min, time_max } = req.body || {};
  return res.json({
    ok: true,
    source: "demo",
    query,
    events: [
      { title: "Demo: TAELED803 class", start: time_min || "2025-08-18T09:00:00Z", end: time_max || "2025-08-18T11:00:00Z", location: "Haymarket 222" }
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
      { from: "Azmal Khokan", subject: "Classroom change TAELED803", snippet: "New room 222 from 4–19 Aug" }
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
      { title: "CCFO 15th Anniversary", url: "https://example.com/ccfo" }
    ]
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
