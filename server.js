const http = require("http");
const fs = require("fs");
const path = require("path");

loadEnv(path.join(__dirname, ".env"));

const PORT = Number(process.env.PORT || 3000);
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";
const MAX_BODY_SIZE = 1_000_000;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === "/api/booking" && req.method === "OPTIONS") {
      setCorsHeaders(res);
      res.writeHead(204);
      return res.end();
    }

    if (req.method === "POST" && req.url === "/api/booking") {
      return handleBooking(req, res);
    }

    if (req.method === "GET" || req.method === "HEAD") {
      return serveStatic(req, res);
    }

    sendJson(res, 405, { ok: false, error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { ok: false, error: "Internal server error" });
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

async function handleBooking(req, res) {
  setCorsHeaders(res);

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return sendJson(res, 500, {
      ok: false,
      error: "Telegram is not configured on server",
    });
  }

  const body = await readJsonBody(req);
  const payload = {
    name: sanitizeValue(body.name),
    phone: sanitizeValue(body.phone),
    service: sanitizeValue(body.service),
    time: sanitizeValue(body.time),
    comment: sanitizeValue(body.comment),
  };

  if (!payload.name || !payload.phone || !payload.service || !payload.time) {
    return sendJson(res, 400, { ok: false, error: "Invalid form payload" });
  }

  const text = [
    "Новая заявка с сайта стоматологии",
    "",
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    `Услуга: ${payload.service}`,
    `Удобное время: ${payload.time}`,
    `Комментарий: ${payload.comment || "-"}`,
  ].join("\n");

  const tgUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const tgResponse = await fetch(tgUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
    }),
  });

  const tgData = await tgResponse.json().catch(() => ({}));
  if (!tgResponse.ok || !tgData.ok) {
    const message = tgData.description || "Failed to send to Telegram";
    return sendJson(res, 502, { ok: false, error: message });
  }

  sendJson(res, 200, { ok: true });
}

function serveStatic(req, res) {
  const rawUrlPath = req.url === "/" ? "/index.html" : req.url;
  const safePath = path.normalize(decodeURIComponent(rawUrlPath)).replace(/^(\.\.[/\\])+/, "");
  const fullPath = path.join(__dirname, safePath);

  if (!fullPath.startsWith(__dirname)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.stat(fullPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404);
      return res.end("Not found");
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, { "Content-Type": contentType });
    if (req.method === "HEAD") {
      return res.end();
    }

    const stream = fs.createReadStream(fullPath);
    stream.on("error", () => {
      res.writeHead(500);
      res.end("Internal server error");
    });
    stream.pipe(res);
  });
}

async function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let data = "";

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_SIZE) {
        reject(new Error("Request body too large"));
        req.destroy();
        return;
      }
      data += chunk;
    });

    req.on("end", () => {
      if (!data) {
        return resolve({});
      }
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error("Invalid JSON payload"));
      }
    });

    req.on("error", reject);
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sanitizeValue(value) {
  return String(value || "").trim().slice(0, 500);
}

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const idx = trimmed.indexOf("=");
    if (idx === -1) {
      continue;
    }

    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}
