/**
 * Croatian Bookkeeping Code → hledger Account Mapping
 *
 * Maps Croatian chart of accounts (217 codes) to standard hledger hierarchy:
 *   Class 0 → assets:non-current:*
 *   Class 1 → assets:bank:* / assets:receivables:* / assets:input-vat:*
 *   Class 2 → liabilities:*
 *   Class 3 → assets:inventory:raw-materials:*
 *   Class 4 → expenses:*
 *   Class 5 → (unused)
 *   Class 6 → assets:inventory:*
 *   Class 7 → income:* / expenses:costs:*
 *   Class 8 → equity:financial-result:*
 *   Class 9 → equity:*
 *
 * @see .ralph/croatian-mapping.md for full documentation
 */

// ── Mapping Data ────────────────────────────────────────────────────

/** Raw Croatian code → hledger account name */
export const CROATIAN_ACCOUNT_MAP: Record<string, string> = {
  "037     ": "assets:non-current:other:037",
  "103     ": "assets:bank:103",
  "105     ": "assets:bank:105",
  "107     ": "assets:bank:107",
  "120     ": "assets:receivables:120",
  "121     ": "assets:receivables:121",
  "125     ": "assets:receivables:125",
  "130     ": "assets:receivables:130",
  "142     ": "assets:receivables:142",
  "196     ": "assets:receivables:196",
  "220     ": "liabilities:accounts-payable:220",
  "221     ": "liabilities:accounts-payable:221",
  "224     ": "liabilities:accounts-payable:224",
  "225     ": "liabilities:accounts-payable:225",
  "242     ": "liabilities:accounts-payable:242",
  "257     ": "liabilities:accounts-payable:257",
  "261     ": "liabilities:accounts-payable:261",
  "264     ": "liabilities:accounts-payable:264",
  "275     ": "liabilities:other:275",
  "280     ": "liabilities:accounts-payable:280",
  "299     ": "liabilities:other:299",
  "351     ": "assets:inventory:raw-materials:351",
  "352     ": "assets:inventory:raw-materials:352",
  "353     ": "assets:inventory:raw-materials:353",
  "355     ": "assets:inventory:raw-materials:355",
  "357     ": "assets:inventory:raw-materials:357",
  "401     ": "expenses:materials:401",
  "405     ": "expenses:materials:405",
  "410     ": "expenses:services:410",
  "411     ": "expenses:services:411",
  "412     ": "expenses:services:412",
  "413     ": "expenses:services:413",
  "414     ": "expenses:services:414",
  "415     ": "expenses:services:415",
  "419     ": "expenses:services:419",
  "430     ": "expenses:depreciation:430",
  "440     ": "expenses:materials:440",
  "441     ": "expenses:payroll:441",
  "443     ": "expenses:payroll:443",
  "445     ": "expenses:payroll:445",
  "464     ": "expenses:payroll:464",
  "470     ": "expenses:taxes:470",
  "491     ": "expenses:other:491",
  "650     ": "assets:inventory:650",
  "664     ": "assets:inventory:664",
  "701     ": "expenses:costs:701",
  "710     ": "expenses:costs:710",
  "713     ": "expenses:costs:713",
  "720     ": "income:720",
  "721     ": "income:721",
  "731     ": "expenses:other:731",
  "732     ": "expenses:other:732",
  "735     ": "expenses:other:735",
  "736     ": "expenses:other:736",
  "737     ": "expenses:other:737",
  "747     ": "expenses:other:747",
  "751     ": "income:sales:751",
  "758     ": "income:sales:758",
  "770     ": "income:sales:770",
  "771     ": "income:sales:771",
  "774     ": "income:financial:774",
  "780     ": "income:sales:780",
  "781     ": "income:sales:781",
  "782     ": "income:financial:782",
  "784     ": "income:sales:784",
  "789     ": "income:financial:789",
  "790     ": "income:790",
  "791     ": "income:791",
  "819     ": "equity:financial-result:819",
  "820     ": "equity:financial-result:820",
  "830     ": "equity:financial-result:830",
  "890     ": "equity:financial-result:890",
  "917     ": "equity:share-capital:917",
  "930     ": "equity:reserves:930",
  "946     ": "equity:reserves:946",
  "949     ": "equity:reserves:949",
  "960     ": "equity:reserves:960",
  "994     ": "equity:994",
  "999     ": "equity:999",
  "1000    ": "assets:bank:1000",
  "1009    ": "assets:bank:1009",
  "1020    ": "assets:bank:1020",
  "1022    ": "assets:bank:1022",
  "1060    ": "assets:bank:1060",
  "1400    ": "assets:input-vat:1400",
  "1401    ": "assets:input-vat:1401",
  "1402    ": "assets:input-vat:1402",
  "1403    ": "assets:input-vat:1403",
  "1404    ": "assets:input-vat:1404",
  "1405    ": "assets:input-vat:1405",
  "2400    ": "liabilities:accounts-payable:2400",
  "2401    ": "liabilities:accounts-payable:2401",
  "2402    ": "liabilities:accounts-payable:2402",
  "2403    ": "liabilities:vat:2403",
  "2404    ": "liabilities:accounts-payable:2404",
  "2405    ": "liabilities:accounts-payable:2405",
  "2571    ": "liabilities:accounts-payable:2571",
  "2601    ": "liabilities:payroll:2601",
  "2603    ": "liabilities:payroll:2603",
  "2605    ": "liabilities:payroll:2605",
  "2606    ": "liabilities:payroll:2606",
  "2608    ": "liabilities:payroll:2608",
  "2609    ": "liabilities:payroll:2609",
  "2640    ": "liabilities:accounts-payable:2640",
  "2641    ": "liabilities:accounts-payable:2641",
  "2642    ": "liabilities:accounts-payable:2642",
  "2643    ": "liabilities:accounts-payable:2643",
  "2644    ": "liabilities:accounts-payable:2644",
  "2645    ": "liabilities:accounts-payable:2645",
  "2646    ": "liabilities:accounts-payable:2646",
  "2710    ": "liabilities:accounts-payable:2710",
  "2744    ": "liabilities:accounts-payable:2744",
  "2752    ": "liabilities:other:2752",
  "2901    ": "liabilities:other:2901",
  "3501    ": "assets:inventory:raw-materials:3501",
  "3503    ": "assets:inventory:raw-materials:3503",
  "3571    ": "assets:inventory:raw-materials:3571",
  "3572    ": "assets:inventory:raw-materials:3572",
  "4001    ": "expenses:materials:4001",
  "4003    ": "expenses:materials:4003",
  "4004    ": "expenses:materials:4004",
  "4011    ": "expenses:materials:4011",
  "4012    ": "expenses:materials:4012",
  "4051    ": "expenses:materials:4051",
  "4052    ": "expenses:materials:4052",
  "4100    ": "expenses:services:4100",
  "4110    ": "expenses:services:4110",
  "4111    ": "expenses:services:4111",
  "4122    ": "expenses:services:4122",
  "4131    ": "expenses:services:4131",
  "4132    ": "expenses:services:4132",
  "4191    ": "expenses:services:4191",
  "4192    ": "expenses:services:4192",
  "4401    ": "expenses:materials:4401",
  "4402    ": "expenses:materials:4402",
  "4431    ": "expenses:payroll:4431",
  "4432    ": "expenses:payroll:4432",
  "4433    ": "expenses:payroll:4433",
  "4443    ": "expenses:payroll:4443",
  "4451    ": "expenses:payroll:4451",
  "4461    ": "expenses:payroll:4461",
  "4463    ": "expenses:payroll:4463",
  "4465    ": "expenses:payroll:4465",
  "4466    ": "expenses:payroll:4466",
  "4468    ": "expenses:payroll:4468",
  "4469    ": "expenses:payroll:4469",
  "4470    ": "expenses:payroll:4470",
  "4471    ": "expenses:payroll:4471",
  "4490    ": "expenses:payroll:4490",
  "4502    ": "expenses:reserves:4502",
  "4616    ": "expenses:payroll:4616",
  "4677    ": "expenses:payroll:4677",
  "4860    ": "expenses:donations:4860",
  "6600    ": "assets:inventory:6600",
  "6630    ": "assets:inventory:6630",
  "6690    ": "assets:inventory:6690",
  "7300    ": "expenses:costs:7300",
  "7350    ": "expenses:other:7350",
  "7361    ": "expenses:other:7361",
  "7371    ": "expenses:other:7371",
  "7513    ": "income:sales:7513",
  "7610    ": "income:sales:7610",
  "7611    ": "income:sales:7611",
  "7711    ": "income:sales:7711",
  "7810    ": "income:sales:7810",
  "7811    ": "income:financial:7811",
  "7812    ": "income:sales:7812",
  "8201    ": "equity:financial-result:8201",
  "9300    ": "equity:reserves:9300",
  "9301    ": "equity:reserves:9301",
  "14000   ": "assets:input-vat:14000",
  "14010   ": "assets:input-vat:14010",
  "14011   ": "assets:input-vat:14011",
  "14030   ": "assets:input-vat:14030",
  "14031   ": "assets:input-vat:14031",
  "021-001 ": "assets:non-current:tangible:021-001",
  "021-002 ": "assets:non-current:tangible:021-002",
  "021-004 ": "assets:non-current:tangible:021-004",
  "021-005 ": "assets:non-current:tangible:021-005",
  "021-300 ": "assets:non-current:tangible:021-300",
  "021-900 ": "assets:non-current:tangible:021-900",
  "24000   ": "liabilities:accounts-payable:24000",
  "24010   ": "liabilities:accounts-payable:24010",
  "24011   ": "liabilities:accounts-payable:24011",
  "24020   ": "liabilities:accounts-payable:24020",
  "24022   ": "liabilities:vat:24022",
  "24030   ": "liabilities:vat:24030",
  "27441   ": "liabilities:payroll:27441",
  "029-001 ": "assets:non-current:accumulated-depreciation:029-001",
  "029-002 ": "assets:non-current:accumulated-depreciation:029-002",
  "029-004 ": "assets:non-current:accumulated-depreciation:029-004",
  "029-005 ": "assets:non-current:accumulated-depreciation:029-005",
  "029-300 ": "assets:non-current:accumulated-depreciation:029-300",
  "029-900 ": "assets:non-current:accumulated-depreciation:029-900",
  "40002   ": "expenses:materials:40002",
  "40122   ": "expenses:materials:40122",
  "40123   ": "expenses:materials:40123",
  "44021   ": "expenses:materials:44021",
  "44712   ": "expenses:payroll:44712",
  "46160   ": "expenses:payroll:46160",
  "46161   ": "expenses:payroll:46161",
  "46162   ": "expenses:payroll:46162",
  "46163   ": "expenses:payroll:46163",
  "46164   ": "expenses:payroll:46164",
  "46165   ": "expenses:payroll:46165",
  "46771   ": "expenses:payroll:46771",
  "46773   ": "expenses:payroll:46773",
  "76111   ": "income:sales:76111",
  "140000  ": "assets:input-vat:140000",
  "021-0011": "assets:non-current:tangible:021-0011",
  "240000  ": "liabilities:accounts-payable:240000",
  "260-001 ": "liabilities:payroll:260-001",
  "290-000 ": "liabilities:other:290-000",
  "029-0011": "assets:non-current:accumulated-depreciation:029-0011",
  "710-001 ": "expenses:costs:710-001",
  "761011  ": "income:sales:761011",
};

// ── Classification by First Digit ───────────────────────────────────

export type AccountClass =
  | "non-current-assets"
  | "current-assets"
  | "liabilities"
  | "raw-materials"
  | "costs-expenses"
  | "internal-allocations"
  | "inventory"
  | "revenue-expenses"
  | "financial-result"
  | "equity";

/** Map first digit of Croatian code to account class */
export const CLASS_BY_FIRST_DIGIT: Record<string, AccountClass> = {
  "0": "non-current-assets",
  "1": "current-assets",
  "2": "liabilities",
  "3": "raw-materials",
  "4": "costs-expenses",
  "5": "internal-allocations",
  "6": "inventory",
  "7": "revenue-expenses",
  "8": "financial-result",
  "9": "equity",
};

// ── Utility Functions ───────────────────────────────────────────────

/**
 * Map a Croatian account code to its hledger account name.
 * Returns undefined if the code is not in the mapping.
 */
export function mapCroatianCode(code: string): string | undefined {
  return CROATIAN_ACCOUNT_MAP[code.trim()];
}

/**
 * Get the account class for a Croatian code based on its first digit.
 */
export function getAccountClass(code: string): AccountClass | undefined {
  const firstDigit = code.trim()[0];
  return CLASS_BY_FIRST_DIGIT[firstDigit];
}

/**
 * Check if a Croatian code is mapped.
 */
export function isMapped(code: string): boolean {
  return code.trim() in CROATIAN_ACCOUNT_MAP;
}

/**
 * Get all unique hledger accounts that would be created from a list of Croatian codes.
 * Returns them in sorted order.
 */
export function getMappedAccounts(codes: string[]): string[] {
  const accounts = new Set<string>();
  for (const code of codes) {
    const mapped = mapCroatianCode(code);
    if (mapped) accounts.add(mapped);
  }
  return [...accounts].sort();
}

/**
 * Get all unmapped codes from a list.
 */
export function getUnmappedCodes(codes: string[]): string[] {
  const unmapped = new Set<string>();
  for (const code of codes) {
    if (!isMapped(code)) unmapped.add(code);
  }
  return [...unmapped].sort();
}

/**
 * Generate account declarations for hledger journal.
 * Only includes accounts that are actually used.
 */
export function generateAccountDeclarations(codes: string[]): string {
  const accounts = getMappedAccounts(codes);
  return accounts.map((a) => `account ${a}`).join("\n");
}

// ── CSV Column Indices (Dnevnik knjiženja format) ──────────────────

/** Standard column indices for Croatian Dnevnik knjiženja CSV */
export const CSV_COLUMNS = {
  DATE: 0,           // DATUM (DD.MM.YYYY)
  PRIORITY: 1,       // PRIORITY
  DIN: 2,            // DIN (document ID)
  DOCUMENT: 3,       // DOKUMENT (document type)
  SEQ: 4,            // BROJ (sequence number)
  ORG_UNIT: 5,       // ORGANIZACIJSKI_DIO
  ACCOUNT: 6,        // KONTO (account code)
  SUB_CODE: 7,       // SIFRA
  ACCOUNT_NAME: 8,   // NAZIV (account/entity name)
  DESCRIPTION: 9,    // OPIS_KNJIZENJA
  DEBIT: 10,         // DUGUJE
  CREDIT: 11,        // POTRAŽUJE
  CONTROLLER: 12,    // KONTROLOR
} as const;

/** Document types found in Croatian accounting journals */
export const DOCUMENT_TYPES = [
  "ACC7CLOSE", "ACCCOSTCLOSE", "ACCOUNTING", "BASTATEMENTX",
  "COMPENSATION", "FINOPENINGX", "INVOICEE", "ITEMINTERNAL",
  "MATINPUT", "PAYROLBOOK24", "PAYROLLNT2", "RETINPUTPKV",
  "RETINTERNAL", "RETPRICECHG", "STOCKBALANCE", "TZ120",
  "URAEU", "URAPE1", "URAPE2", "URAPE3",
  "XINVADCANCEL", "XINVOICEAD", "XINVOICECAN", "XINVOICESB",
  "XRETOUTPUT",
] as const;
