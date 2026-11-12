import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const baseUrl = process.env.VITE_API_BASE_URL;

if (!baseUrl) {
  console.error("VITE_API_BASE_URL is missing in .env");
  process.exit(1);
}

const cli = fileURLToPath(new URL("bin/cli.js", import.meta.resolve("openapi-typescript/package.json")));
const schemaUrl = new URL("/openapi.json", baseUrl).href;

execFileSync(process.execPath, [cli, schemaUrl, "-o", "src/api/schema.d.ts"], { stdio: "inherit" });
