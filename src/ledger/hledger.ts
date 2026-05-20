import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

// ── Error types ─────────────────────────────────────────────────────

export class HledgerNotFoundError extends Error {
  constructor() {
    super("hledger not found. Install: https://hledger.org/install");
    this.name = "HledgerNotFoundError";
  }
}

export class HledgerCommandError extends Error {
  stdout: string;
  stderr: string;
  constructor(stdout: string, stderr: string) {
    const output = [stdout, stderr].filter(Boolean).join("\n");
    super(output);
    this.name = "HledgerCommandError";
    this.stdout = stdout;
    this.stderr = stderr;
  }
}

// ── Commands ────────────────────────────────────────────────────────

export async function runHledger(args: string[], opts?: { cwd?: string; signal?: AbortSignal }): Promise<string> {
  const { exitCode, stdout, stderr } = await spawn(["hledger", ...args], opts);
  if (exitCode === 127) throw new HledgerNotFoundError();
  if (exitCode !== 0) throw new HledgerCommandError(stdout, stderr);
  return stdout;
}

export async function tryRunHledger(
  args: string[],
  opts?: { cwd?: string; signal?: AbortSignal },
): Promise<string | null> {
  try {
    return await runHledger(args, opts);
  } catch (e) {
    if (e instanceof HledgerNotFoundError) throw e;
    return null;
  }
}

export async function hledgerCheck(journalPath: string, opts?: { cwd?: string; signal?: AbortSignal }): Promise<void> {
  await runHledger(["check", "--strict", "-f", journalPath], opts);
}

// ── Internals ───────────────────────────────────────────────────────

async function spawn(
  cmd: string[],
  opts?: { cwd?: string; signal?: AbortSignal },
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  try {
    const controller = new AbortController();
    if (opts?.signal) {
      opts.signal.addEventListener("abort", () => controller.abort(), { once: true });
    }

    const { stdout, stderr } = await execFileAsync(cmd[0], cmd.slice(1), {
      cwd: opts?.cwd,
      signal: controller.signal,
      maxBuffer: 10 * 1024 * 1024, // 10MB
    });

    return { exitCode: 0, stdout, stderr };
  } catch (err: any) {
    if (err?.code === "ENOENT") {
      return { exitCode: 127, stdout: "", stderr: `Command not found: ${cmd[0]}` };
    }
    if (err?.code === "ABORT_ERR") {
      return { exitCode: 143, stdout: "", stderr: "Command aborted" };
    }
    // execFile throws on non-zero exit — extract stdout/stderr/exitCode
    if (err?.stdout !== undefined && err?.stderr !== undefined) {
      return {
        exitCode: err.code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER" ? 1 : (err.status ?? 1),
        stdout: err.stdout ?? "",
        stderr: err.stderr ?? "",
      };
    }
    throw err;
  }
}
