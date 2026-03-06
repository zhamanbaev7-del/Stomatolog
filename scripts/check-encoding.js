const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const INCLUDE_EXTENSIONS = new Set([".html", ".css", ".js", ".md", ".json"]);
const EXCLUDE_DIRS = new Set([".git", "node_modules", ".next", ".idea", ".vscode"]);

// Typical mojibake markers for Cyrillic text decoded with wrong charset.
// We intentionally avoid broad Cyrillic matches to prevent false positives.
const SUSPICIOUS_PATTERNS = [
  /Р[\u0400-\u040F\u0450-\u045F\u2018-\u201F]/,
  /С[\u0400-\u040F\u0450-\u045F\u2018-\u201F]/,
  /Ð[\u0080-\u00BF]/,
  /Ñ[\u0080-\u00BF]/,
];

const files = [];
walk(ROOT, files);

const offenders = [];

for (const filePath of files) {
  const content = fs.readFileSync(filePath, "utf8");

  // Skip known external script injections that can appear in "View Source" locally.
  if (content.includes("kaspersky-labs.com")) {
    continue;
  }

  if (isSuspicious(content)) {
    offenders.push(path.relative(ROOT, filePath));
  }
}

if (offenders.length) {
  console.error("Encoding check failed. Suspicious text found in:");
  for (const file of offenders) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log("Encoding check passed.");

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) {
        continue;
      }
      walk(path.join(dir, entry.name), out);
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    const ext = path.extname(entry.name).toLowerCase();
    if (INCLUDE_EXTENSIONS.has(ext)) {
      out.push(fullPath);
    }
  }
}

function isSuspicious(text) {
  return SUSPICIOUS_PATTERNS.some((pattern) => pattern.test(text));
}
