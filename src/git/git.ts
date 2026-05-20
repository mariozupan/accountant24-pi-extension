import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

// ── Commands ────────────────────────────────────────────────────────

export async function gitInit(cwd: string): Promise<boolean> {
  if (existsSync(join(cwd, ".git"))) return false;
  await spawn(["git", "init"], { cwd });
  return true;
}

export async function hasChanges(cwd: string): Promise<boolean> {
  const { stdout } = await spawn(["git", "status", "--porcelain"], { cwd });
  return stdout.trim().length > 0;
}

export async function hasRemotes(cwd: string): Promise<boolean> {
  const { stdout } = await spawn(["git", "remote"], { cwd });
  return stdout.trim().length > 0;
}

export async function commitAll(cwd: string, message: string): Promise<void> {
  await spawn(["git", "add", "-A"], { cwd });
  await spawn(["git", "commit", "-m", message], { cwd });
}

export async function diffStat(cwd: string): Promise<string[]> {
  // Stage everything first so new/deleted files appear in the diff
  await spawn(["git", "add", "-A"], { cwd });
  const { stdout } = await spawn(["git", "diff", "--cached", "--name-only"], { cwd });
  return stdout
    .trim()
    .split("\n")
    .filter((f) => f.length > 0);
}

export async function push(cwd: string): Promise<void> {
  await spawn(["git", "push", "origin", "HEAD"], { cwd });
}

// ── Internals ───────────────────────────────────────────────────────

async function spawn(
  cmd: string[],
  opts: { cwd: string },
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  try {
    const { stdout, stderr } = await execFileAsync(cmd[0], cmd.slice(1), {
      cwd: opts.cwd,
      maxBuffer: 10 * 1024 * 1024, // 10MB
    });

    return { exitCode: 0, stdout, stderr };
  } catch (err: any) {
    if (err?.code === "ENOENT") {
      return { exitCode: 127, stdout: "", stderr: `Command not found: ${cmd[0]}` };
    }
    if (err?.stdout !== undefined && err?.stderr !== undefined) {
      return {
        exitCode: err.status ?? 1,
        stdout: err.stdout ?? "",
        stderr: err.stderr ?? "",
      };
    }
    throw err;
  }
}
