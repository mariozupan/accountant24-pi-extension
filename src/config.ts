import { join } from "node:path";

export let ACCOUNTANT24_HOME = process.env.ACCOUNTANT24_HOME ?? join(process.cwd(), "zupsy-hledgers-journals");
export let MEMORY_PATH = join(ACCOUNTANT24_HOME, "memory.md");
export let LEDGER_DIR = join(ACCOUNTANT24_HOME, "ledger");
export let FILES_DIR = join(ACCOUNTANT24_HOME, "files");

export function setBaseDir(dir: string): void {
  ACCOUNTANT24_HOME = dir;
  MEMORY_PATH = join(dir, "memory.md");
  LEDGER_DIR = join(dir, "ledger");
  FILES_DIR = join(dir, "files");
}
