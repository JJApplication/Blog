const fs = require("node:fs/promises");
const path = require("node:path");

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function copyDirectory(from, to) {
  await fs.mkdir(path.dirname(to), { recursive: true });
  await fs.cp(from, to, { recursive: true, force: true });
  console.log(`[copy] ${from} -> ${to}`);
}

async function main() {
  const root = process.cwd();
  const standaloneDir = path.join(root, ".next", "standalone");
  const standaloneNextDir = path.join(standaloneDir, ".next");
  const staticFrom = path.join(root, ".next", "static");
  const staticTo = path.join(standaloneNextDir, "static");
  const publicFrom = path.join(root, "public");
  const publicTo = path.join(standaloneDir, "public");

  if (!(await pathExists(standaloneDir))) {
    throw new Error(
      "Missing `.next/standalone`. Please ensure `next.config.js` has `output: 'standalone'` and `next build` completed successfully."
    );
  }

  if (!(await pathExists(staticFrom))) {
    throw new Error("Missing `.next/static`. `next build` may not have completed.");
  }

  await fs.mkdir(standaloneNextDir, { recursive: true });
  await copyDirectory(staticFrom, staticTo);

  if (await pathExists(publicFrom)) {
    await copyDirectory(publicFrom, publicTo);
  } else {
    console.log("[skip] `public` directory not found, skip copy.");
  }

  console.log("[done] Standalone assets prepared.");
}

main().catch((error) => {
  console.error("[error]", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
