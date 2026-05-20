import { readdir, stat } from "node:fs/promises";
import { basename, dirname, join, sep } from "node:path";
import type { AutocompleteItem, AutocompleteProvider, SlashCommand } from "@earendil-works/pi-tui";
import { fuzzyFilter } from "@earendil-works/pi-tui";
import { ACCOUNTANT24_HOME } from "../config";

const PATH_DELIMITERS = new Set([" ", "\t", '"', "'", "="]);

export class AccountantAutocompleteProvider implements AutocompleteProvider {
  private commands: SlashCommand[];
  private accounts: string[] = [];
  private payees: string[] = [];
  private tags: string[] = [];

  constructor(commands: SlashCommand[]) {
    this.commands = commands;
  }

  setCommands(commands: SlashCommand[]): void {
    this.commands = commands;
  }

  setData(accounts: string[], payees: string[], tags: string[]): void {
    this.accounts = accounts;
    this.payees = payees;
    this.tags = tags;
  }

  async getSuggestions(
    lines: string[],
    cursorLine: number,
    cursorCol: number,
    _options?: { signal: AbortSignal; force?: boolean },
  ) {
    const line = lines[cursorLine] || "";
    const before = line.slice(0, cursorCol);

    // @ trigger: payee/account mentions (using the current token)
    const atPrefix = this.extractAtPrefix(before);
    if (atPrefix) {
      const query = atPrefix.slice(1); // remove leading @
      const items: AutocompleteItem[] = [
        ...this.accounts.map((a) => ({ value: a, label: a, description: "account" })),
        ...this.payees.map((p) => ({ value: p, label: p, description: "payee" })),
        ...this.tags.map((t) => ({ value: t, label: t, description: "tag" })),
      ];
      const filtered = query ? fuzzyFilter(items, query, (item) => item.label) : items;
      if (filtered.length === 0) return null;
      return { items: filtered, prefix: atPrefix };
    }

    // / trigger: slash commands (check if the line up to cursor starts with "/")
    if (before.startsWith("/")) {
      const spaceIndex = before.indexOf(" ");
      if (spaceIndex === -1) {
        // Complete command names
        const prefix = before.slice(1); // remove leading slash
        const commandItems = this.commands.map((cmd) => ({
          name: cmd.name,
          label: cmd.name,
          description: cmd.description,
        }));
        const filtered = fuzzyFilter(commandItems, prefix, (item) => item.name).map((item) => ({
          value: item.name,
          label: item.label,
          ...(item.description && { description: item.description }),
        }));
        if (filtered.length === 0) return null;
        return { items: filtered, prefix: before };
      }
      // Complete command arguments
      const commandName = before.slice(1, spaceIndex);
      const argumentText = before.slice(spaceIndex + 1);
      const command = this.commands.find((cmd) => cmd.name === commandName);
      if (!command?.getArgumentCompletions) return null;
      const argumentSuggestions = await command.getArgumentCompletions(argumentText);
      if (!argumentSuggestions || argumentSuggestions.length === 0) return null;
      return { items: argumentSuggestions, prefix: argumentText };
    }

    // Path completion trigger (when not @mention or slash command)
    const pathSuggestion = await this.getPathSuggestions(before);
    if (pathSuggestion) {
      return pathSuggestion;
    }

    return null;
  }

  applyCompletion(lines: string[], cursorLine: number, cursorCol: number, item: AutocompleteItem, prefix: string) {
    const line = lines[cursorLine] || "";
    const beforePrefix = line.slice(0, cursorCol - prefix.length);
    const after = line.slice(cursorCol);
    const newLines = [...lines];

    // Slash command completion
    if (prefix.startsWith("/") && beforePrefix.trim() === "" && !prefix.slice(1).includes("/")) {
      newLines[cursorLine] = `${beforePrefix}/${item.value} ${after}`;
      return { lines: newLines, cursorLine, cursorCol: beforePrefix.length + item.value.length + 2 };
    }

    // Slash command argument completion
    if (beforePrefix.includes("/") && beforePrefix.includes(" ")) {
      newLines[cursorLine] = `${beforePrefix}${item.value}${after}`;
      return { lines: newLines, cursorLine, cursorCol: beforePrefix.length + item.value.length };
    }

    // @ mention completion — insert value with trailing space
    newLines[cursorLine] = `${beforePrefix}${item.value} ${after}`;
    return { lines: newLines, cursorLine, cursorCol: beforePrefix.length + item.value.length + 1 };
  }

  private extractAtPrefix(text: string): string | null {
    let lastDelim = -1;
    for (let i = text.length - 1; i >= 0; i--) {
      if (PATH_DELIMITERS.has(text[i])) {
        lastDelim = i;
        break;
      }
    }
    const tokenStart = lastDelim === -1 ? 0 : lastDelim + 1;
    if (text[tokenStart] === "@") return text.slice(tokenStart);
    return null;
  }

  private async getPathSuggestions(before: string): Promise<{ items: AutocompleteItem[]; prefix: string } | null> {
    // Extract the current token (word before cursor) for path completion
    const token = this.extractCurrentToken(before);
    if (token === null || token === "") return null;

    // Handle trailing slash - if user types "somedir/", we want to list contents of somedir
    let dir: string;
    let base: string;
    if (token.endsWith(sep)) {
      // User typed a trailing slash, so we want to list the contents of that directory
      dir = token.slice(0, -1); // remove the trailing slash
      base = "";
    } else {
      dir = dirname(token === "" ? "." : token);
      base = basename(token);
    }

    // Resolve directory relative to ACCOUNTANT24_HOME
    const absDir = join(ACCOUNTANT24_HOME, dir);

    try {
      const entries = await readdir(absDir, { withFileTypes: true });
      const items: AutocompleteItem[] = [];

      for (const entry of entries) {
        // Skip hidden files unless the base starts with a dot
        if (entry.name.startsWith(".") && !base.startsWith(".")) {
          continue;
        }

        if (base && !entry.name.startsWith(base)) {
          continue;
        }

        let value = entry.name;
        if (entry.isDirectory()) {
          value += sep; // Add trailing slash for directories
        }
        items.push({
          value,
          label: entry.name,
          description: entry.isDirectory() ? "directory" : "file",
        });
      }

      if (items.length === 0) return null;

      // Return the base part as the prefix to replace
      return { items, prefix: base };
    } catch (err) {
      return null;
    }
  }

  // Helper to extract the current token (word before cursor)
  private extractCurrentToken(text: string): string | null {
    // Find start of current token (after last delimiter)
    let lastDelim = -1;
    const delimiters = new Set([
      " ",
      "\t",
      '"',
      "'",
      "=",
      "(",
      ")",
      "{",
      "}",
      "[",
      "]",
      "|",
      "&",
      ";",
      "<",
      ">",
      "`",
      "\\",
    ]);

    for (let i = text.length - 1; i >= 0; i--) {
      if (delimiters.has(text[i])) {
        lastDelim = i;
        break;
      }
    }

    const tokenStart = lastDelim === -1 ? 0 : lastDelim + 1;
    return text.slice(tokenStart) || null;
  }
}
