import type { ExtensionAPI, ExtensionFactory, SettingsManager } from "@earendil-works/pi-coding-agent";
import { SettingsManager as SettingsManagerClass, VERSION } from "@earendil-works/pi-coding-agent";
import { ACCOUNTANT24_HOME } from "./config";
import { createExtension } from "./extension";

const SETTINGS_OVERRIDES = {
  quietStartup: true,
  collapseChangelog: true,
  lastChangelogVersion: VERSION,
  terminal: { showImages: false, clearOnShrink: false },
  images: { autoResize: false, blockImages: false },
} as const;

/**
 * Default export — pi extension entry point.
 *
 * Pi's extension loader calls this function with the ExtensionAPI
 * when the extension is loaded. We create our own SettingsManager
 * (since we're not running as a standalone binary) and delegate
 * to the shared createExtension factory.
 */
export default function (pi: ExtensionAPI): void {
  const settingsManager = SettingsManagerClass.create(ACCOUNTANT24_HOME, ACCOUNTANT24_HOME);
  settingsManager.applyOverrides(SETTINGS_OVERRIDES);

  const factory = createExtension(settingsManager);
  factory(pi);
}
