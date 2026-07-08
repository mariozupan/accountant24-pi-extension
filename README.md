# Accountant24 — Pi Coding Agent Extension

Domain-specific accounting extension for the [pi coding agent](https://github.com/mariozechner/pi-coding-agent). Turns pi into a personal finance assistant powered by [hledger](https://hledger.org/).

## What it does

Accountant24 gives pi the ability to manage your finances through natural conversation: logging spending, importing bank statements, answering questions, and keeping your books clean. It registers custom tools, slash commands, autocomplete providers, and a dynamic system prompt — all loaded automatically when pi starts.

## Prerequisites

| Tool | Required for | Install |
|------|-------------|---------|
| **pi coding agent** | Core runtime | `npm install -g @mariozechner/pi-coding-agent` |
| **hledger** | Ledger operations (query, validate, add transactions) | [hledger.org/install](https://hledger.org/install) |
| **git** | Workspace versioning, commit & push | Your OS package manager |
| **poppler** (`pdftotext`) | PDF text extraction (optional) | `brew install poppler` / `apt install poppler-utils` |
| **tesseract** | OCR for scanned PDFs/images (optional) | `brew install tesseract` / `apt install tesseract-ocr` |

> **Note:** hledger is **required** for all accounting features. The other tools are optional — without them, file extraction and OCR simply won't be available.

## Installation

```bash
pi install git:github.com/mariozupan/accountant24-pi-extension

That's it. The extension auto-loads on every pi startup. No config changes needed.

### Verify installation

pi
# You should see the Accountant24 header on startup
# Type /accounts to verify tools are loaded
```

## Features

### Custom Tools (7)

| Tool | Description |
|------|-------------|
| `add_transactions` | Add one or more transactions. Auto-routes to monthly files, validates, generates diffs |
| `query` | Run hledger reports: balance, register, income statement, balance sheet, and more |
| `validate` | Check the ledger for errors via `hledger check --strict` |
| `extract_text` | Extract text from PDFs and images (with OCR fallback) |
| `copy_file_to_workspace` | Store external files (bank statements, receipts) in the workspace |
| `update_memory` | Rewrite `memory.md` with user preferences, rules, and facts |
| `commit_and_push` | Stage, commit, and push workspace changes to git |

### Slash Commands (4)

| Command | Description |
|---------|-------------|
| `/accounts` | List all accounts grouped by type |
| `/payees` | List all known payees |
| `/tags` | List all tags used in the ledger |
| `/memory` | View current AI memory |

### Autocomplete

Type `@` in the input field to quickly search and mention accounts, payees, and tags. Tab-completion also works for file paths within the workspace.

### Dynamic System Prompt

Before each agent turn, the extension injects live context into the system prompt:
- Today's date
- Current `memory.md` contents
- All known accounts, payees, and tags from the ledger
- Tool metadata with descriptions and guidelines

### Workspace Scaffolding

On first session start, the extension creates a structured workspace:

```
~/Accountant24/
├── ledger/
│   ├── main.journal          # Entry point (includes other files)
│   ├── accounts.journal      # Default chart of accounts
│   ├── commodities.journal   # Commodity declarations
│   └── YYYY/
│       └── MM.journal        # Monthly transaction files
├── memory.md                  # Persistent AI memory
├── files/                     # Stored documents (bank statements, etc.)
│   └── YYYY/
│       └── MM/
└── sessions/                  # Session data
```

## Usage Examples

### Log a transaction

> "I spent 45 EUR on groceries at Spar"

Accountant24 uses `add_transactions` to record it, validates the ledger, and shows a diff.

### Query spending

> "How much did I spend on food this month?"

Uses `query` with `report=bal`, `account_pattern=Expenses:Food`, and date filters.

### Import a bank statement

> Send a PDF file → Accountant24 copies it to workspace, extracts text, and offers to record transactions.

### Check ledger health

> "Is my ledger valid?"

Runs `validate` → `hledger check --strict`.

## Configuration

### Custom workspace location

Set the `ACCOUNTANT24_HOME` environment variable to change the workspace directory:

```bash
export ACCOUNTANT24_HOME=/path/to/my/ledger
pi
```

### Settings overrides

The extension applies these defaults on startup:

```json
{
  "quietStartup": true,
  "collapseChangelog": true,
  "terminal": { "showImages": false, "clearOnShrink": false },
  "images": { "autoResize": false, "blockImages": false }
}
```

## Architecture

```
pi coding agent
  └── accountant24-extension (this repo)
        ├── tools/          # Custom tool definitions + builtin overrides
        ├── commands/       # Slash commands
        ├── ledger/         # hledger CLI wrapper + transaction pipeline
        ├── memory/         # Persistent memory management
        ├── files/          # File extraction, diff, storage
        ├── git/            # Git operations
        ├── ui/             # Headers, footer, autocomplete, message renderers
        ├── system-prompt/  # Dynamic prompt generation
        └── scaffold/       # Workspace initialization + templates
```

### Key adaptations for pi extension compatibility

- `Bun.spawn` → Node.js `child_process.execFile` (pi runs on Node.js)
- Bun text imports → `fs.readFileSync` (jiti doesn't support import attributes)
- Standardized `@earendil-works/pi-tui` imports (matches globally installed pi)

## Uninstall

```bash
rm -rf ~/.pi/agent/extensions/accountant24-pi-extension
```

## License

MIT
