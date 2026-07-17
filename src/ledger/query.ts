import { ACCOUNTANT24_HOME } from "../config";
import { runHledger } from "./hledger";
import { resolveSafePath } from "./paths";
import { CROATIAN_ACCOUNT_MAP } from "./croatian-mapping";

const PERIOD_FLAGS: Record<string, string> = {
  daily: "--daily",
  weekly: "--weekly",
  monthly: "--monthly",
  quarterly: "--quarterly",
  yearly: "--yearly",
};

// TUI box border (2) + padding (2) + content indent (2)
const TUI_CHROME_WIDTH = 6;

export interface QueryLedgerResult {
  command: string;
  output: string;
}

export async function queryLedger(params: any, signal?: AbortSignal): Promise<QueryLedgerResult> {
  const file = params.file ?? "ledger/main.journal";
  const resolved = resolveSafePath(file, ACCOUNTANT24_HOME);
  const args = buildQueryArgs(params, resolved);
  const raw = await runHledger(args, { signal });
  const command = ["hledger", ...args].join(" ");
  return { command, output: raw || "(no results)" };
}

function resolveAccountPattern(pattern: string): string {
  const trimmed = pattern.trim();
  // If the pattern is exactly a Croatian code, resolve it
  if (CROATIAN_ACCOUNT_MAP[trimmed]) {
    return CROATIAN_ACCOUNT_MAP[trimmed];
  }
  // If it starts with digit, try partial match against all codes
  // so user can type '1000' and get 'assets:bank:1000'
  if (/^\d/.test(trimmed)) {
    for (const [code, account] of Object.entries(CROATIAN_ACCOUNT_MAP)) {
      if (code.startsWith(trimmed) || account.includes(trimmed)) {
        return account;
      }
    }
  }
  // Otherwise pass through as-is (could be a regex or a hledger path)
  return trimmed;
}

function buildQueryArgs(params: any, resolved: string): string[] {
  const args = [params.report, "-f", resolved];

  if (params.account_pattern) args.push(resolveAccountPattern(params.account_pattern));
  if (params.description_pattern) args.push(`desc:${params.description_pattern}`);
  if (params.payee_pattern) args.push(`payee:${params.payee_pattern}`);
  if (params.amount_filter) args.push(`amt:${params.amount_filter}`);
  if (params.tag) args.push(`tag:${params.tag}`);
  if (params.status === "cleared") args.push("status:*");
  else if (params.status === "pending") args.push("status:!");
  else if (params.status === "unmarked") args.push("status:");

  if (params.begin_date) args.push("-b", params.begin_date);
  if (params.end_date) args.push("-e", params.end_date);
  else args.push("-e", "tomorrow");

  if (params.period && PERIOD_FLAGS[params.period]) {
    args.push(PERIOD_FLAGS[params.period]);
  }

  if (params.depth != null) args.push("--depth", String(params.depth));
  if (params.invert) args.push("--invert");
  if (params.output_format) args.push("-O", params.output_format);

  if (params.report === "reg" || params.report === "aregister") {
    const width = (process.stdout.columns || 80) - TUI_CHROME_WIDTH;
    args.push(`--width=${width}`);
  }

  return args;
}
