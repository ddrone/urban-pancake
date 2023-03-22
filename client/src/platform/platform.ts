import { BrowserPlatform } from "./browser";

export interface Platform {
  loadState(): Promise<string|undefined>;
  saveState(state: string): void;
  onClose(callback: () => void): void;
}

export const platform = new BrowserPlatform();