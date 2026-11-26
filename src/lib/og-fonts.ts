import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Hubot Sans as static .woff (the OG image renderer can't read .woff2 or variable fonts).
// Read once at module scope so the images can be generated at build time.
const dir = join(process.cwd(), "assets/fonts");
const [medium, bold] = await Promise.all([
  readFile(join(dir, "hubot-sans-latin-500-normal.woff")),
  readFile(join(dir, "hubot-sans-latin-700-normal.woff")),
]);

export const displayFonts = [
  { name: "Hubot Sans", data: medium, style: "normal" as const, weight: 500 as const },
  { name: "Hubot Sans", data: bold, style: "normal" as const, weight: 700 as const },
];
