import type { ExtensionFactory, SettingsManager } from "@earendil-works/pi-coding-agent";
import { CustomEditor } from "@earendil-works/pi-coding-agent";
import { Loader } from "@earendil-works/pi-tui";
import { accountsCommand, memoryCommand, payeesCommand, tagsCommand } from "./commands";
import { listAccounts, listPayees, listTags } from "./ledger";
import { getMemory } from "./memory";
import { ensureScaffolded } from "./scaffold/scaffold";
import { getSystemPrompt } from "./system-prompt";
import {
  addTransactionsTool,
  commitAndPushTool,
  copyFileToWorkspaceTool,
  extractTextTool,
  queryTool,
  updateMemoryTool,
  validateTool,
} from "./tools";
import { extractMeta, registerBuiltinOverrides } from "./tools/builtin-overrides";
import {
  AccountantAutocompleteProvider,
  createHeaderFactory,
  type ModelFooter,
  registerInfoMessageRenderer,
  updateDisplay,
} from "./ui";

const LoaderProto = Loader.prototype as unknown as Record<string, any>;
LoaderProto.updateDisplay = updateDisplay;

export function createExtension(settingsManager: SettingsManager): ExtensionFactory {
  return (pi) => {
    const footer: ModelFooter | null = null;

    // Override built-in tools with custom rendering
    const builtinMeta = registerBuiltinOverrides(pi);

    // Register custom tools
    pi.registerTool(queryTool);
    pi.registerTool(addTransactionsTool);
    pi.registerTool(commitAndPushTool);
    pi.registerTool(copyFileToWorkspaceTool);
    pi.registerTool(extractTextTool);
    pi.registerTool(validateTool);
    pi.registerTool(updateMemoryTool);

    // Collect prompt metadata from all tools (custom first, then built-in)
    const allToolMeta = [
      ...[
        queryTool,
        addTransactionsTool,
        commitAndPushTool,
        copyFileToWorkspaceTool,
        extractTextTool,
        validateTool,
        updateMemoryTool,
      ].map(extractMeta),
      ...builtinMeta,
    ];

    // Register custom slash commands
    accountsCommand(pi);
    payeesCommand(pi);
    tagsCommand(pi);
    memoryCommand(pi);

    // Register custom message renderers
    registerInfoMessageRenderer(pi);

    // Shared autocomplete provider — updated with fresh data before each agent turn
    const autocomplete = new AccountantAutocompleteProvider([]);

    const TITLE = "Accountant24";
    const setTerminalTitle = () => process.stdout.write(`\x1b]0;${TITLE}\x07`);

    // Scaffold workspace + set up UI on session start
    pi.on("session_start", async (_event, ctx) => {
      const freshScaffold = await ensureScaffolded();
      if (freshScaffold) {
        pi.sendMessage({
          customType: "info",
          content: [{ type: "text", text: "Workspace wiley-2027 Accountant24, hledger extension, with zupsy Croatian journals created at `./zupsy-hledger-jiurnals`." }],
          display: true,
        });
      }
      if (ctx.hasUI) {
        // Override the framework's "π - dirname" title (runs after updateTerminalTitle)
        setTimeout(setTerminalTitle, 100);
        ctx.ui.setHeader(createHeaderFactory());
        // NOTE: No custom footer set - default pi footer (with model + status bar) will appear

        // Get all available commands (built-in and from other extensions)
        const builtinCommands = pi.getCommands().map((cmd) => ({
          name: cmd.name,
          description: cmd.description,
        }));
        const extensionCommands = [
          { name: "accounts", description: "List accounts" },
          { name: "payees", description: "List payees" },
          { name: "tags", description: "List tags" },
          { name: "memory", description: "View/edit AI memory" },
          { name: "export", description: "Export session" },
          { name: "tree", description: "Show session tree" },
          { name: "compact", description: "Compact context" },
          { name: "help", description: "Show help" },
          { name: "settings", description: "View settings" },
          { name: "theme", description: "Select theme" },
          { name: "skills", description: "Manage skills" },
          { name: "prompt", description: "Manage prompt templates" },
          { name: "new", description: "Start a new session" },
          { name: "resume", description: "Resume a different session" },
          { name: "model", description: "Select model" },
          { name: "login", description: "Login with OAuth provider" },
          { name: "logout", description: "Logout from OAuth provider" },
          { name: "session", description: "Show session info and stats" },
          { name: "hotkeys", description: "Show all keyboard shortcuts" },
          { name: "quit", description: "Quit Accountant24" },
        ];
        const slashCommands = [...builtinCommands, ...extensionCommands];

        // Set up the autocomplete provider with commands and data
        autocomplete.setCommands(slashCommands);
        const [accounts, payees, tags] = await Promise.all([listAccounts(), listPayees(), listTags()]);
        autocomplete.setData(accounts, payees, tags);

        // Prevent the framework from overwriting our autocomplete provider
        // after the editor component factory runs.
        ctx.ui.setEditorComponent((tui, theme, keybindings) => {
          const editor = new CustomEditor(tui, theme, keybindings, {
            autocompleteMaxVisible: settingsManager.getAutocompleteMaxVisible(),
            paddingX: settingsManager.getEditorPaddingX(),
          });
          editor.setAutocompleteProvider(autocomplete);
          editor.setAutocompleteProvider = () => { }; // prevent overwrite
          // No custom footer to set editor on
          return editor;
        });
      }
    });

    // Inject dynamic context into system prompt before each agent turn
    pi.on("before_agent_start", async (_event, ctx) => {
      const today = new Date().toISOString().split("T")[0];
      const [memory, accounts, payees, tags] = await Promise.all([
        getMemory(),
        listAccounts(),
        listPayees(),
        listTags(),
      ]);

      if (ctx.hasUI) {
        ctx.ui.setTitle(TITLE);
        ctx.ui.setWorkingMessage("Crunching the numbers...");
      }

      return { systemPrompt: getSystemPrompt({ today, memory, accounts, payees, tags, tools: allToolMeta }) };
    });

    // Maintain terminal title across agent lifecycle
    pi.on("agent_start", async (_event, ctx) => {
      if (ctx.hasUI) ctx.ui.setTitle(TITLE);
    });

    // Refresh autocomplete after each agent turn so new payees/accounts are available
    pi.on("agent_end", async (_event, ctx) => {
      if (ctx.hasUI) ctx.ui.setTitle(TITLE);
      const [accounts, payees, tags] = await Promise.all([listAccounts(), listPayees(), listTags()]);
      autocomplete.setData(accounts, payees, tags);
    });

    // No custom footer to update on model change - default pi footer handles this automatically
  };
}
