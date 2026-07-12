import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { ACCOUNTANT24_HOME } from "../config";
import { commitAll, gitInit } from "../git";

const TEMPLATE_DIR = join(dirname(new URL(import.meta.url).pathname), "template");

/** Workspace scaffold manifest. Relative paths → file contents. */
const TEMPLATE_FILES: Record<string, string> = {
  "memory.md": readFileSync(join(TEMPLATE_DIR, "memory.md"), "utf-8"),
  ".gitignore": readFileSync(join(TEMPLATE_DIR, ".gitignore"), "utf-8"),
  "ledger/accounts.journal": readFileSync(join(TEMPLATE_DIR, "ledger", "accounts.journal"), "utf-8"),
  "ledger/commodities.journal": readFileSync(join(TEMPLATE_DIR, "ledger", "commodities.journal"), "utf-8"),
  "ledger/main.journal": readFileSync(join(TEMPLATE_DIR, "ledger", "main.journal"), "utf-8"),
};

function writeIfNotExists(filePath: string, content: string): void {
  if (!existsSync(filePath)) {
    writeFileSync(filePath, content);
  }
}


export async function ensureScaffolded(): Promise<boolean> {
  const home = ACCOUNTANT24_HOME;
  const isNew = !existsSync(home);

  for (const dir of ["ledger", "files", "sessions"]) {
    mkdirSync(join(home, dir), { recursive: true });
  }

  for (const [relPath, content] of Object.entries(TEMPLATE_FILES)) {
    const outputPath = join(home, relPath);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeIfNotExists(outputPath, content);
  }

  const freshRepo = await gitInit(home);
  if (freshRepo) {
    await commitAll(home, "Initial Accountant24 setup");
  }

  return isNew;
}


